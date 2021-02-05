<template>
  <q-page>
    <div class="hotel-banner-container text-center">
      <q-img :src="hotelLogoBanner" height="128px">
        <div class="absolute-center">
          <div class="text-h5">{{ hotel.name }}</div>
        </div>
      </q-img>
    </div>

    <div class="q-pa-md">
      <q-markup-table flat>
        <tbody>
          <tr v-for="floor in hotel.floors" :key="floor._id">
            <td v-if="hotel.floors.length > 1">{{ floor.label }}</td>
            <td class="q-gutter-sm">
              <q-btn
                v-for="room in floor.rooms"
                size="xl"
                class="q-px-sm"
                :key="room._id"
                :label="room.label"
                :flat="!room.occupied && !room.available"
                :outline="room.occupied"
                :color="
                  !room.available ? 'grey' : room.occupied ? 'red' : 'green'
                "
                @click="toggleOccupiedStatus(room)"
                @contextmenu.prevent="viewRoom(room)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- {{ roomsMap }} -->

    <q-dialog v-model="showRoomOptions">
      <RoomUpdateCard :room="selectedRoom" @bill="displayBill" />
    </q-dialog>

    <q-dialog v-model="showBill">
      <BillCard v-bind="billData" />
    </q-dialog>

    <q-dialog v-model="captureDialog">
      <ImageCapture @capture="handleCapture" />
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment-timezone";
import fs from "fs-extra";

export default {
  name: "PageOverview",

  components: {
    RoomUpdateCard: () => import("components/RoomUpdateCard"),
    BillCard: () => import("components/BillCard"),
    ImageCapture: () => import("components/ImageCapture")
  },

  data() {
    return {
      showRoomOptions: false,
      selectedRoom: null,

      roomState: null,
      booking: null,

      captureDialog: false,
      aadharFilePath: null,

      showBill: false,
      billData: null,

      floors: [],

      futureSync: false
    };
  },

  computed: {
    // reversedFloors() {
    //   return [...this.floors].sort((a, b) => b.order - a.order);
    // },

    hotelLogoBanner() {
      return "https://picsum.photos/seed/" + this.hotel._id + "/1024/128";
    },

    hotel() {
      return this.$store.getters["general/hotel"];
    },

    bookingsMap() {
      return this.$store.getters["general/bookingsMap"];
    },

    roomsMap() {
      return this.$store.getters["general/roomsMap"];
    },

    locked: {
      get() {
        return this.$store.getters["general/locked"];
      }
    },

    user() {
      return this.$store.getters["auth/user"];
    },

    connected() {
      return navigator.onLine;
    }
  },

  watch: {
    hotel: {
      handler: function() {
        if (this.connected) {
          this.syncHotelRooms();
        } else {
          this.futureSync = true;
        }
      },
      deep: true
    },

    connected(connectionStatus) {
      if (connectionStatus && this.futureSync) {
        this.syncHotelRooms();
      }
    }
  },

  methods: {
    syncHotelRooms() {
      this.$axios
        .put(
          process.env.API + "/hotels/" + this.hotel._id + "/rooms",
          this.hotel
        )
        .then(response => {
          this.futureSync = false;
        })
        .catch(console.error);
    },

    async handleCapture(blob) {
      let now = new moment.tz("Asia/Kolkata");

      let directory =
        this.$q.electron.remote.app.getPath("userData") +
        "/Root-HMS/images/aadhar/" +
        now.format("YYYY-MM-DD");

      let fileName =
        now.format("HH-mm-ss") + "_" + this.selectedRoom._id + ".png";

      this.aadharFilePath = directory + "/" + fileName;

      let fileData = new Int8Array(await blob.arrayBuffer());

      fs.outputFileSync(this.aadharFilePath, fileData);

      this.captureDialog = false;

      this.doCheckIn();
    },

    async viewRoom(room) {
      if (this.user.type == "manager") {
        if (this.locked) {
          return this.$store.dispatch("general/setLock", false);
        }

        this.selectedRoom = room;
        this.showRoomOptions = true;
      }
    },

    displayBill(data) {
      this.billData = data;
      this.showBill = true;
    },

    async toggleOccupiedStatus(room) {
      if (this.user.type == "manager") {
        if (this.locked) {
          return this.$store.dispatch("general/setLock", false);
        }

        this.selectedRoom = room;

        if (this.selectedRoom.occupied) {
          this.checkOut();
        } else {
          if (room.available) this.checkIn();
        }
      }
    },

    async checkIn() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Would you like to check in?",
          cancel: true,
          ok: {
            label: "Check in"
          }
        })
        .onOk(() => {
          this.startCheckInFlow();
        });
    },

    startCheckInFlow() {
      this.captureDialog = true;
    },

    async doCheckIn() {
      try {
        let guest = await this.$db.Guest.asyncInsert({
          name: "Unknown",
          aadhar: this.aadharFilePath
        });

        await this.$db.Booking.asyncInsert({
          room: this.selectedRoom._id,
          guest: guest._id,
          checkIn: new Date(),
          rent: 0,
          aadhar: this.aadharFilePath
        });

        this.$store.dispatch("general/setOccupied", {
          roomIndex: this.roomsMap[this.selectedRoom._id],
          occupied: true
        });
      } catch (err) {
        console.error(err);
      }

      this.$q.notify({
        type: "positive",
        message: "Checked in."
      });
    },

    checkOut() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Would you like to check out?",
          cancel: true,
          ok: {
            label: "Check out"
          }
        })
        .onOk(() => {
          this.doCheckOut();
        });
    },

    async doCheckOut() {
      let checkOut = new Date();

      try {
        await this.$db.Booking.asyncUpdate(
          {
            room: this.selectedRoom._id,
            checkOut: {
              $exists: false
            }
          },
          {
            $set: {
              checkOut
            }
          }
        );

        this.$store.dispatch("general/setOccupied", {
          roomIndex: this.roomsMap[this.selectedRoom._id],
          occupied: false
        });
      } catch (err) {
        console.error(err);
      }

      this.$q.notify({
        type: "positive",
        message: "Checked out."
      });
    }
  }
};
</script>

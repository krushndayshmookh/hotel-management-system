<template>
  <q-page>
    <div class="hotel-banner-container text-center">
      <q-img :src="hotelLogoBanner" height="128px" />
    </div>

    <div class="q-pa-md">
      <q-markup-table flat>
        <tbody>
          <tr v-for="floor in reversedFloors" :key="floor._id">
            <td v-if="reversedFloors.length > 1">{{ floor.label }}</td>
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

    <q-dialog v-model="showRoomOptions">
      <RoomUpdateCard
        :room="selectedRoom"
        @bill="displayBill"
        @done="fetchFloors"
      />
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
      hotelLogoBanner: "https://picsum.photos/1024/128",

      showRoomOptions: false,
      selectedRoom: null,

      roomState: null,
      booking: null,

      captureDialog: false,
      aadharFilePath: null,

      showBill: false,
      billData: null,

      floors: []
    };
  },

  computed: {
    reversedFloors() {
      return [...this.floors].sort((a, b) => b.order - a.order);
    },

    locked: {
      get() {
        return this.$store.getters["general/locked"];
      }
    },

    user() {
      return this.$store.getters["auth/user"];
    }
  },

  created() {
    this.fetchFloors();
  },

  methods: {
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

    async fetchFloors() {
      let floors = await this.$db.Floor.asyncFind({});
      for (let i = 0; i < floors.length; i++) {
        floors[i].rooms = await this.$db.Room.asyncFind({
          floor: floors[i]._id
        });
      }

      this.floors = floors;
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
          this.checkIn();
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

        await this.$db.Room.asyncUpdate(
          {
            _id: this.selectedRoom._id
          },
          {
            $set: {
              occupied: true
            }
          }
        );
      } catch (err) {
        console.error(err);
      }

      this.fetchFloors();

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
            label: "Checkout"
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

        await this.$db.Room.asyncUpdate(
          {
            _id: this.selectedRoom._id
          },
          {
            $set: {
              occupied: false
            }
          }
        );
      } catch (err) {
        console.error(err);
      }

      this.fetchFloors();

      this.$q.notify({
        type: "positive",
        message: "Checked out."
      });
    }
  }
};
</script>

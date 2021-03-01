<template>
  <q-page>
    <div class="hotel-banner-container text-center">
      <q-img :src="hotel.banner || hotelLogoBanner" height="196px">
        <div class="absolute-bottom">
          <div class="text-h4  q-mb-md" v-if="!hotel.banner">
            {{ hotel.name }}
          </div>

          <div class="summary text-center q-gutter-sm">
            <q-badge color="green-7" class="text-body1">
              Occupied: {{ roomCounts.occupied }}
            </q-badge>
            <!-- <q-badge color="grey-9">
              Unavailable: {{ roomCounts.unavailable }}
            </q-badge> -->
            <!-- <q-badge color="primary">Total: {{ roomCounts.total }}</q-badge> -->
          </div>
        </div>
      </q-img>
    </div>

    <div class="q-pa-md q-px-xl">
      <q-markup-table flat>
        <tbody>
          <tr v-for="floor in hotel.floors" :key="floor._id">
            <td v-if="hotel.floors.length > 1">{{ floor.label }}</td>
            <td class="q-gutter-sm">
              <div class="row q-col-gutter-lg">
                <div
                  class="col-4 col-sm-3 col-md-2 col-lg-1"
                  v-for="room in floor.rooms"
                  :key="room._id"
                >
                  <q-btn
                    size="xl"
                    class="q-px-sm full-width q-py-sm"
                    :label="room.label"
                    :flat="!room.occupied && !room.available"
                    :outline="room.occupied"
                    :color="
                      !room.available ? 'grey' : room.occupied ? 'red' : 'green'
                    "
                    @click="toggleOccupiedStatus(room)"
                    @contextmenu.prevent="viewRoom(room)"
                  />
                </div>
              </div>
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

    <q-dialog v-model="captureDialog" :maximized="$q.screen.lt.sm">
      <ImageCapture @capture="handleCapture" />
    </q-dialog>
  </q-page>
</template>

<script>
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

      futureSync: false,

      futureBookings: []
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

    roomCounts() {
      return this.$store.getters["general/roomCounts"];
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

        this.pushBookings();
      }
    }
  },

  methods: {
    syncHotelRooms() {
      this.$axios
        .put("/hotels/" + this.hotel._id + "/rooms", this.hotel)
        .then(response => {
          this.futureSync = false;
        })
        .catch(console.error);
    },

    pushBookings(bookings = this.futureBookings) {
      this.$axios
        .put("/hotels/" + this.hotel._id + "/bookings", bookings)
        .then(response => {
          this.futureSync = false;
          this.futureBookings = [];
        })
        .catch(console.error);
    },

    async handleCapture(blob) {
      this.$fs.writeFile(this.selectedRoom._id, blob);

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

        let bk = await this.$db.Booking.asyncInsert({
          room: this.selectedRoom._id,
          guest: guest._id,
          checkIn: new Date(),
          rent: 0,
          aadhar: this.aadharFilePath
        });

        if (this.connected) {
          this.pushBookings([bk]);
        } else {
          this.futureSync = true;
          this.futureBookings.push(bk);
        }

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
        let bk = await this.$db.Booking.asyncFindOne({
          room: this.selectedRoom._id,
          checkOut: {
            $exists: false
          }
        });

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

        if (bk) {
          bk.checkOut = checkOut;

          if (this.connected) {
            this.pushBookings([bk]);
          } else {
            this.futureSync = true;
            this.futureBookings.push(bk);
          }
        }

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

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
  </q-page>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "PageOverview",

  components: {
    RoomUpdateCard: () => import("components/RoomUpdateCard"),
    BillCard: () => import("components/BillCard")
  },

  data() {
    return {
      hotelLogoBanner: "https://picsum.photos/1024/128",

      showRoomOptions: false,
      selectedRoom: null,

      roomState: null,
      booking: null,

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
        }
      }
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

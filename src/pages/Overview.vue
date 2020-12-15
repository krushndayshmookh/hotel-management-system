<template>
  <q-page>
    <div class="hotel-banner-container text-center">
      <q-img :src="hotelLogoBanner" height="128px" />
    </div>

    <div class="q-pa-md">
      <q-markup-table flat>
        <tbody>
          <tr v-for="floor in reversedFloors" :key="floor._id">
            <td>{{ floor.label }}</td>
            <td class="q-gutter-sm">
              <q-btn
                v-for="room in floor.rooms"
                :key="room._id"
                :label="room.label"
                :flat="!room.occupied && !room.available"
                :outline="room.occupied"
                :color="
                  !room.available ? 'grey' : room.occupied ? 'red' : 'green'
                "
                @click="viewRoom(room)"
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
      if (this.locked) {
        return this.$store.dispatch("general/setLock", false);
      }

      this.selectedRoom = room;
      this.showRoomOptions = true;
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
    }
  }
};
</script>

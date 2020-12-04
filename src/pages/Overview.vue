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
  </q-page>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "PageOverview",

  data() {
    return {
      hotelLogoBanner: "https://picsum.photos/1024/128",

      floors: [
        {
          _id: "0",
          label: "Ground",
          order: 0,
          rooms: [
            {
              _id: "G01",
              label: "G01",
              occupied: true,
              ouccupant: {
                _id: "krushn",
                name: "Krushn",
                checkIn: new moment().tz("Asia/Kolkata")
              },
              available: true
            }
          ]
        },
        {
          _id: "1",
          order: 1,
          label: "First",
          rooms: [
            {
              _id: "101",
              label: "101",
              occupied: false,
              ouccupant: null,
              available: true
            },
            {
              _id: "102",
              label: "102",
              occupied: false,
              ouccupant: null,
              available: false
            }
          ]
        }
      ]
    };
  },

  computed: {
    reversedFloors() {
      return [...this.floors].sort((a, b) => b.order - a.order);
    }
  },

  methods: {
    viewRoom(room) {
      console.log("view", {...room});
    }
  }
};
</script>

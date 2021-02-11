<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-h6">Bookings</div>
                </div>

                <div class="col-12" v-if="!$q.screen.lt.sm">
                  <q-btn-toggle
                    push
                    spread
                    toggle-color="primary"
                    :options="monthOptions"
                    v-model="selectedMonth"
                  />
                </div>

                <div class="col-12" v-if="!$q.screen.lt.sm">
                  <q-btn-toggle
                    push
                    spread
                    toggle-color="primary"
                    :options="roomOptions"
                    v-model="selectedRoom"
                  />
                </div>

                <div class="col-6 col-md-3" v-if="$q.screen.lt.sm">
                  <q-select
                    outlined
                    dense
                    :options="rooms"
                    option-label="label"
                    option-value="_id"
                    label="Room"
                    v-model="selectedRoom"
                    map-options
                    emit-value
                  />
                </div>
                <div class="col-6 col-md-3" v-if="$q.screen.lt.sm">
                  <q-select
                    outlined
                    dense
                    :options="months"
                    label="Month"
                    v-model="selectedMonth"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-markup-table flat bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>
                        Bookings in Room {{ selectedRoomName }} in
                        {{ selectedMonth }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, idx) in bookingsByRoomAndMonth"
                      :key="idx"
                    >
                      <td>{{ item.day + 1 }} {{ selectedMonth }}</td>
                      <td>
                        {{ item.value }}
                        <q-icon
                          name="star"
                          color="orange"
                          v-if="item.value > 1"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="col-12 col-sm-6">
                <q-markup-table flat bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Bookings in {{ selectedMonth }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in bookingsThisMonth" :key="idx">
                      <td>{{ item.day + 1 }} {{ selectedMonth }}</td>
                      <td>
                        {{ item.value }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Bookings in {{ selectedMonth }}</div>
          </q-card-section>
          <q-card-section>
            <la-cartesian
              narrow
              :bound="[0]"
              :data="bookingsThisMonth"
              autoresize
              stacked
            >
              <la-bar
                v-for="l in roomsLabels"
                :prop="l"
                :key="l"
                :label="'Room ' + l"
              ></la-bar>

              <la-x-axis prop="day"></la-x-axis>
              <la-tooltip></la-tooltip>
              <la-legend selectable></la-legend>
            </la-cartesian>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Bookings by Month</div>
          </q-card-section>
          <q-card-section>
            <la-cartesian
              narrow
              :bound="[0]"
              :data="bookingsByMonth"
              autoresize
            >
              <la-bar prop="value"></la-bar>
              <la-x-axis prop="label"></la-x-axis>
              <la-tooltip></la-tooltip>
            </la-cartesian>
          </q-card-section>
        </q-card>
      </div> -->
    </div>
  </q-page>
</template>

<script>
import moment from "moment-timezone";
import _ from "lodash";

const NOW = new moment();

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export default {
  data() {
    return {
      bookings: [],

      now: NOW,
      months: MONTHS,

      selectedRoom: null,
      selectedMonth: null
    };
  },

  computed: {
    // bookingsByMonth() {
    //   let data = [
    //     { label: "Jan", value: 0 },
    //     { label: "Feb", value: 0 },
    //     { label: "Mar", value: 0 },
    //     { label: "Apr", value: 0 },
    //     { label: "May", value: 0 },
    //     { label: "Jun", value: 0 },
    //     { label: "Jul", value: 0 },
    //     { label: "Aug", value: 0 },
    //     { label: "Sep", value: 0 },
    //     { label: "Oct", value: 0 },
    //     { label: "Nov", value: 0 },
    //     { label: "Dec", value: 0 }
    //   ];

    //   this.bookings.forEach(booking => {
    //     let date = new moment(booking.checkIn);
    //     data[date.month()].value++;
    //   });

    //   return data;
    // },

    // bookingsThisMonth() {
    //   if (this.selectedMonth) {
    //     let data = {};

    //     let dot = {};

    //     this.roomsLabels.forEach(r => (dot[r] = 0));

    //     for (let i = 0; i < this.daysInSelectedMonth; i++)
    //       data[i + 1] = _.cloneDeep(dot);

    //     this.bookings
    //       .filter(
    //         booking =>
    //           new moment(booking.checkIn).month() == this.selectedMonthValue
    //       )
    //       .forEach(booking => {
    //         let date = new moment(booking.checkIn);
    //         let roomLabel = this.roomsLabels[this.roomsMap[booking.room]];
    //         data[date.date()][roomLabel]++;
    //       });

    //     data = Object.keys(data).map(day => ({
    //       day,
    //       ...data[day]
    //     }));

    //     return data;
    //   }
    //   return [];
    // },

    bookingsThisMonth() {
      if (this.selectedMonth) {
        let data = [];

        for (let i = 0; i < this.daysInSelectedMonth; i++)
          data.push({ day: i, value: 0 });

        this.bookings
          .filter(
            booking =>
              new moment(booking.checkIn).month() == this.selectedMonthValue
          )
          .forEach(booking => {
            let date = new moment(booking.checkIn);
            data[date.date()].value++;
          });

        return data;
      }
      return [];
    },

    daysInSelectedMonth() {
      return new moment(this.selectedMonth, "MMM").daysInMonth();
    },

    selectedMonthValue() {
      return new moment(this.selectedMonth, "MMM").month();
    },

    bookingsByRoomAndMonth() {
      if (this.selectedRoom && this.selectedMonth) {
        let data = [];

        for (let i = 0; i < this.daysInSelectedMonth; i++)
          data.push({ day: i, value: 0 });

        this.bookings
          .filter(
            booking =>
              new moment(booking.checkIn).month() == this.selectedMonthValue &&
              booking.room == this.selectedRoom
          )
          .forEach(booking => {
            let date = new moment(booking.checkIn);
            data[date.date()].value++;
          });

        return data;
      }
      return [];
    },

    rooms() {
      return this.$store.getters["general/rooms"];
    },

    roomsMap() {
      return this.$store.getters["general/roomsMap"];
    },

    roomsLabels() {
      return this.rooms.map(r => r.label);
    },

    roomOptions() {
      return this.rooms.map(r => ({ label: "Room " + r.label, value: r._id }));
    },

    monthOptions() {
      return this.months.map(m => ({ label: m, value: m }));
    },

    roomIds() {
      return this.rooms.map(r => r._id);
    },

    selectedRoomName() {
      return this.roomsLabels[this.roomIds.indexOf(this.selectedRoom)];
    }
  },

  mounted() {
    this.fetchBookings();
  },

  methods: {
    async fetchBookings() {
      this.bookings = await this.$db.Booking.asyncFind({});
    }
  }
};
</script>

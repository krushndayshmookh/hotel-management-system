<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
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
              <!-- <la-y-axis></la-y-axis> -->
              <la-x-axis prop="label"></la-x-axis>
              <la-tooltip></la-tooltip>
            </la-cartesian>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Bookings in {{ now.format("MMMM") }}</div>
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
              <!-- <la-y-axis></la-y-axis> -->
              <la-x-axis prop="day"></la-x-axis>
              <la-tooltip></la-tooltip>
              <la-legend selectable></la-legend>
            </la-cartesian>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from "moment-timezone";
import _ from "lodash";

const NOW = new moment();

export default {
  data() {
    return {
      bookings: [],

      now: NOW
    };
  },

  computed: {
    bookingsByMonth() {
      let data = [
        { label: "Jan", value: 0 },
        { label: "Feb", value: 0 },
        { label: "Mar", value: 0 },
        { label: "Apr", value: 0 },
        { label: "May", value: 0 },
        { label: "Jun", value: 0 },
        { label: "Jul", value: 0 },
        { label: "Aug", value: 0 },
        { label: "Sep", value: 0 },
        { label: "Oct", value: 0 },
        { label: "Nov", value: 0 },
        { label: "Dec", value: 0 }
      ];

      this.bookings.forEach(booking => {
        let date = new moment(booking.checkIn);
        data[date.month()].value++;
      });

      return data;
    },

    bookingsThisMonth() {
      let data = {};

      let dot = {};

      this.roomsLabels.forEach(r => (dot[r] = 0));

      for (let i = 0; i < NOW.daysInMonth(); i++)
        data[i + 1] = _.cloneDeep(dot);

      this.bookings
        .filter(booking => new moment(booking.checkIn).month() == NOW.month())
        .forEach(booking => {
          let date = new moment(booking.checkIn);
          let roomLabel = this.roomsLabels[this.roomsMap[booking.room]];
          data[date.day()][roomLabel]++;
        });

      data = Object.keys(data).map(day => ({
        day,
        ...data[day]
      }));

      return data;
    },

    rooms() {
      return this.$store.getters["general/rooms"];
    },

    roomsMap() {
      return this.$store.getters["general/roomsMap"];
    },

    roomsLabels() {
      return this.rooms.map(r => r.label);
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

<template>
  <q-page padding>
    <q-btn @click="generateData" color="primary">Generate Data</q-btn>
  </q-page>
</template>

<script>
import moment from "moment-timezone";

const floors = [
  {
    _id: "0",
    label: "Ground",
    order: 0
  },
  {
    _id: "1",
    label: "First",
    order: 1
  },
  {
    _id: "2",
    label: "Second",
    order: 2
  }
];

const rooms = [
  {
    _id: "01",
    label: "G01",
    occupied: false,
    available: true,
    floor: "0"
  },
  {
    _id: "02",
    label: "G02",
    occupied: false,
    available: false,
    floor: "0"
  },
  {
    _id: "11",
    label: "101",
    occupied: true,
    available: true,
    floor: "1"
  },
  {
    _id: "21",
    label: "201",
    occupied: false,
    available: true,
    floor: "2"
  }
];

const guests = [
  {
    _id: "g1",
    name: "Krushn",
    photo: "https://picsum.photos/seed/krushn/48/48"
  }
];

const bookings = [
  {
    guest: "g1",
    room: "01",
    checkIn: new moment.tz("Asia/Kolkata").subtract(3, "days").toDate(),
    checkOut: new moment.tz("Asia/Kolkata").subtract(2, "days").toDate()
  },
  {
    guest: "g1",
    room: "11",
    checkIn: new moment.tz("Asia/Kolkata").toDate()
  }
];

export default {
  methods: {
    async generateData() {
      this.$q.loading.show();
      await this.clean();

      const { Guest, Room, Floor, Booking } = this.$db;

      await Guest.asyncInsert(guests);
      await Room.asyncInsert(rooms);
      await Floor.asyncInsert(floors);
      await Booking.asyncInsert(bookings);

      this.$q.notify("Generated fresh data.");

      this.displayData();
      this.$q.loading.hide();
    },

    async clean() {
      const { Guest, Room, Floor, Booking } = this.$db;

      await Guest.asyncRemove({});
      await Room.asyncRemove({});
      await Floor.asyncRemove({});
      await Booking.asyncRemove({});

    },

    async displayData() {
      const { Guest, Room, Floor, Booking } = this.$db;
      const data = {
        Guest: await Guest.asyncFind({}),
        Room: await Room.asyncFind({}),
        Floor: await Floor.asyncFind({}),
        Booking: await Booking.asyncFind({})
      };

      console.log(data);
    }
  }
};
</script>

import Vue from "vue";
import { AsyncNedb } from "nedb-async";

const Guest = new AsyncNedb({
  filename: "guests",
  autoload: true
});

const Room = new AsyncNedb({
  filename: "rooms",
  autoload: true
});

const Floor = new AsyncNedb({
  filename: "floors",
  autoload: true
});

const Booking = new AsyncNedb({
  filename: "bookings",
  autoload: true
});

Guest.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Room.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Floor.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Booking.ensureIndex({ fieldName: "_id", unique: true, sparse: true });

const db = { Guest, Room, Floor, Booking };

Vue.prototype.$db = db;

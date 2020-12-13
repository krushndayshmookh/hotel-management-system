import Vue from "vue";
import Datastore from "nedb";

const Guest = new Datastore({
  filename: "guests",
  autoload: true
});

const Room = new Datastore({
  filename: "rooms",
  autoload: true
});

const Floor = new Datastore({
  filename: "floors",
  autoload: true
});

const Booking = new Datastore({
  filename: "bookings",
  autoload: true
});

Guest.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Room.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Floor.ensureIndex({ fieldName: "_id", unique: true, sparse: true });
Booking.ensureIndex({ fieldName: "_id", unique: true, sparse: true });

const db = { Guest, Room, Floor, Booking };

Vue.prototype.$db = db;

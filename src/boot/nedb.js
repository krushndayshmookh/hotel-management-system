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

const db = { Guest, Room, Floor, Booking };

Vue.prototype.$db = db;

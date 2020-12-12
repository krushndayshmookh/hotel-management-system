import Vue from "vue";
import Datastore from "nedb";
import path from "path";

const Occupant = new Datastore({
  filename: "occupants",
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

const db = { Occupant, Room, Floor };

Vue.prototype.$db = db;

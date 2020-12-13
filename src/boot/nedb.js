import Vue from "vue";
import Datastore from "nedb";
import path from "path";

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

const db = { Guest, Room, Floor };

Vue.prototype.$db = db;

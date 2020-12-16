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

async function resetWith(hotel) {
  await Room.asyncRemove({}, { multi: true });
  await Floor.asyncRemove({}, { multi: true });
  await Booking.asyncRemove({}, { multi: true });

  // await Room.persistence.compactDatafile();
  // await Floor.persistence.compactDatafile();
  // await Booking.persistence.compactDatafile();

  await Room.asyncInsert(hotel.rooms);
  await Floor.asyncInsert(hotel.floors);
  await Booking.asyncInsert(hotel.bookings);
}

const db = { Guest, Room, Floor, Booking, resetWith };

Vue.prototype.$db = db;

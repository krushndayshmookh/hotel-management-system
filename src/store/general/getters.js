export function locked({ locked }) {
  return locked;
}

export function hotel({ hotel }) {
  return hotel;
}

export function bookings({ bookings }) {
  return bookings;
}

export function bookingsMap({ bookings }) {
  let map = {};
  bookings.forEach((b, idx) => (map[b._id] = idx));
  return map;
}

export function roomsMap({ hotel }) {
  let map = {};
  hotel.floors[0].rooms.forEach((b, idx) => (map[b._id] = idx));
  return map;
}

export function rooms({ hotel }) {
  return hotel.floors[0].rooms;
}

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

export function roomCounts({ hotel }) {
  let allRooms = hotel.floors[0].rooms;
  let occupied = allRooms.filter(room => room.occupied).length;
  let unavailable = allRooms.filter(room => !room.available).length;
  let total = allRooms.length;
  return { occupied, unavailable, total };
}

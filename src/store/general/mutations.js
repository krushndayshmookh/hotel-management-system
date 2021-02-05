export function setLock(state, payload) {
  state.locked = payload;
}

export function setHotel(state, payload) {
  state.hotel = payload;
}

export function setOccupied(state, { roomIndex, occupied }) {
  state.hotel.floors[0].rooms[roomIndex].occupied = occupied;
}

export function setRoom(state, { roomIndex, occupied, available }) {
  state.hotel.floors[0].rooms[roomIndex].occupied = occupied;
  state.hotel.floors[0].rooms[roomIndex].available = available;
}

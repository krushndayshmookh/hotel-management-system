interface Room {
  _id: string;
  label: string;
  occupied: boolean;
  available: boolean;
}

interface Booking {
  guest: Guest;
  room: Room;
  checkIn: Date;
  checkOut?: Date;
}

interface Floor {
  _id: string;
  label: string;
  order: number;
  rooms: Room[];
}

interface Guest {
  _id: string;
  name: string;
  photo: string;
}

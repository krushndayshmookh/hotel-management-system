interface Room {
  _id: string;
  label: string;
  occupied: boolean;
  available: boolean;
  floor: Floor;
}

interface Booking {
  guest: Guest;
  room: Room;
  checkIn: Date;
  checkOut?: Date;
  rent: number;
}

interface Floor {
  _id: string;
  label: string;
  order: number;
}

interface Guest {
  _id: string;
  name: string;
  photo: string;
}

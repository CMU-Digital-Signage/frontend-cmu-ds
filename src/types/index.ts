export interface User {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAdmin: boolean | null;
}

export interface Device {
  MACaddress: string;
  deviceName: string;
  room: number | string;
  location: any;
  description: string;
}

export interface Poster {
  title: string;
  id: number;
  duration: number;
  recurrence: string;
  description: string;
  image: any;
  createdAt: Date | null;
  updatedAt: Date | null;
  MACaddress: string;
}

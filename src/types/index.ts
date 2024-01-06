export interface User {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAdmin: boolean | null;
}

export interface Device {
  MACaddress: string | null;
  deviceName: string | null;
  room: string | null;
  location: any;
  description: string | null;
}

export interface Poster {
  title: string;
  id: number;
  duration: number;
  recurrence: string;
  description: string;
  image: any;
  createdAt: Date;
  updatedAt: Date;
  MACaddress: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
}

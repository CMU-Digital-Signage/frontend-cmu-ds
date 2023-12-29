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
  room: number | string | null;
  location: any;
  description: string | null;
}
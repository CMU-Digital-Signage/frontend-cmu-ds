export interface User {
  id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface Device {
  MACaddress: string | null;
  deviceName: string | null;
  room: string | null;
  location: any;
  description: string | null;
}

export interface Poster {
  MACaddress: string;
  posterId: string;
  id: string;
  title: string;
  duration: number;
  recurrence: string;
  description: string;
  image: any;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
}

export interface Emergency {
  incidentName: string;
  emergencyImage: any;
  description: string | null;
  status: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export interface Device {
  MACaddress: string | null;
  deviceName: string | null;
  room: string | null;
  location: any;
  description: string | null;
  color: string;
  status: boolean;
}

export interface Poster {
  MACaddress: string;
  posterId: string;
  id: string;
  title: string;
  image: ImageCollection[];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  uploader: string;
  status: string;
  type: string;
}

export interface ImageCollection {
  priority: number;
  image: any;
}

export interface Display {
  allDay: boolean;
  allDevice: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  time: DisplayTime[];
  duration: number | null;
  MACaddress: string[];
}

export interface DisplayTime {
  startTime: Date | undefined;
  endTime: Date | undefined;
}

export interface Emergency {
  incidentName: string;
  emergencyImage: any;
  description: string | null;
  status: boolean | string;
}

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
  color: string;
}

export interface Poster {
  MACaddress: string;
  posterId: string;
  id: string;
  title: string;
  image: any;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  uploader: string;
  status: boolean;
}

export interface Display {
  allDay: boolean;
  allDevice: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  time: [{ startTime: Date; endTime: Date | undefined }];
  duration: number | null;
  MACaddress: string[];
}

export interface Emergency {
  incidentName: string;
  emergencyImage: any;
  description: string | null;
  status: boolean;
}

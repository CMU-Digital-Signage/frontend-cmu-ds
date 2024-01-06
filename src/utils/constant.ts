import { Device } from "@/types";
import Compressor from "compressorjs";

export const fullMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const day = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

export const initialFormDevice = {
  MACaddress: null,
  deviceName: null,
  room: null,
  location: null,
  description: null,
} as Device;

export const onUpload = (e: any): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const file = e.files[0];
    if (!file) reject("No file selected");

    const reader = new FileReader();

    new Compressor(file, {
      quality: 0.6,
      async success(result) {
        e.files[0] = new File([result], "locationImage");
        reader.readAsDataURL(result);
        reader.onloadend = function () {
          console.log(reader.result);
          resolve(reader.result as string);
        };
      },
    });
  });
};

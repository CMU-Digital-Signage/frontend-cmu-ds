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

export const customDateFormatter = (date: Date | undefined) => {
  if (!date) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


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

    let quality = 1;
    if (file.size > 1000000) {
      quality = 0.6;
    }
    new Compressor(file, {
      quality: quality,
      async success(result) {
        e.files[0] = new File([result], "locationImage");
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = function () {
          console.log(reader.result);
          resolve(reader.result as string);
        };
      },
    });
  });
};

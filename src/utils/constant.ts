import { Device } from "@/types";
import Compressor from "compressorjs";
import { FileUploadSelectEvent } from "primevue/fileupload";

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

export const onUpload = (
  e: FileUploadSelectEvent
): Promise<string | undefined> => {
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
          resolve(reader.result as string);
        };
      },
    });
  });
};

export const rotate = (file: File, currentDeg: number, deg: number) => {
  return new Promise<{ imageDataUrl: string; newDeg: number }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          const newDeg = currentDeg + deg;

          // Rotate the image
          canvas.width = img.height;
          canvas.height = img.width;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((newDeg * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.drawImage(img, 0, 0);


          // Convert the rotated image to base64
          const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);
          console.log(imageDataUrl);
          
          resolve({ imageDataUrl, newDeg });
        };
      };
    }
  );
};

import { Device, Display } from "@/types";
import Compressor from "compressorjs";
import { FileUploadSelectEvent } from "primevue/fileupload";

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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

export const customDateFormatter = (date: Date | null | undefined) => {
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

export const initialFormDisplay = {
  MACaddress: [],
  allDay: false,
  allDevice: false,
  startDate: undefined,
  endDate: undefined,
  time: [
    {
      startTime: new Date("2024-01-01T08:00:00"),
      endTime: undefined,
    },
  ],
  duration: null,
} as Display;

export const onUpload = (
  e: FileUploadSelectEvent
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const file = e.files[0];
    if (!file) reject("No file selected");

    const targetSize = 700 * 1024; // 700 kb
    let quality = 1;

    const compressFile = async (compressionQuality: number) => {
      return new Promise<void>((resolve, reject) => {
        new Compressor(file, {
          quality: compressionQuality,
          async success(result) {
            e.files[0] = new File([result], "locationImage");
            resolve();
          },
          error(error) {
            reject(error);
          },
        });
      });
    };

    const attemptCompression = async () => {
      try {
        await compressFile(quality);
        if (e.files[0].size < targetSize) {
          const reader = new FileReader();
          reader.readAsDataURL(e.files[0]);
          reader.onloadend = function () {
            resolve(reader.result as string);
          };
        } else {
          quality = quality * 0.6;
          if (quality > 0.1) {
            attemptCompression();
          } else {
            reject("Unable to compress below the target size");
          }
        }
      } catch (error) {
        reject(error);
      }
    };

    attemptCompression();
  });
};

export const rotate = (file: File, currentDeg: number, deg: number) => {
  return new Promise<{ imageDataUrl: string; newDeg: number }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const img = new Image();
        img.src = reader.result as string;

        img.onload = function () {
          let newDeg = currentDeg + deg;
          if (Math.abs(newDeg) === 360) {
            newDeg = 0;
          }

          // Rotate the image
          if (Math.abs(newDeg) === 180 || Math.abs(newDeg) === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
          } else {
            canvas.width = img.height;
            canvas.height = img.width;
          }
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((newDeg * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);

          // Convert the rotated image to base64
          const imageDataUrl = canvas.toDataURL(file.type, 1.0);
          resolve({ imageDataUrl, newDeg });
        };
      };
    }
  );
};

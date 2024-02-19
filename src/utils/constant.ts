import store from "@/store";
import { Device, Display, Poster } from "@/types";
import Compressor from "compressorjs";

export const checkTokenExpired = (token: string) => {
  try {
    const decode = JSON.parse(atob(token.split(".")[1]));
    // check email
    if (decode.email.includes(store.state.userInfo.email)) {
      // check expired
      if (decode.exp * 1000 >= new Date().getTime()) {
        return "Success";
      }
    }
    return "Link Expired.";
  } catch (err) {
    // token invalid
    return "Invalid Token.";
  }
};

export const color = [
  "#7986CB",
  "#33B679",
  "#8E24AA",
  "#E67C73",
  "#F6BF26",
  "#F4511E",
  "#039BE5",
  "#616161",
  "#3F51B5",
  "#0B8043",
  "#D50000",
  "#FF8C00",
  "#20B2AA",
  "#87CEEB",
  "#FF1493",
  "#8A2BE2",
  "#BB85D6",
  "#B84770",
  "#0B5E87",
  "#008080",
  "#006EEB",
  "#71A7F8",
];

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

export const dateFormatter = (
  date: Date | null | undefined,
  format?: number
) => {
  if (!date) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
  const monthFullStr = fullMonth[date.getMonth()];
  const monthStr = month[date.getMonth()];
  const year = date.getFullYear();

  switch (format) {
    case 1:
      return `${day}/${monthNum}/${year}`; // 22/11/2023
    case 2:
      return `${day} ${monthFullStr} ${year}`; //22 November 2023
    default:
      return `${day} ${monthStr} ${year}`; //22 Nov 2023;
  }
};

export const initialFormDevice = {
  MACaddress: null,
  deviceName: null,
  room: null,
  location: null,
  description: null,
} as Device;

const initialFormDisplay = {
  MACaddress: [],
  allDay: false,
  allDevice: false,
  startDate: undefined,
  endDate: undefined,
  time: [],
  duration: null,
} as Display;

export const newInitialFormDisplay = () => {
  return {
    ...initialFormDisplay,
    MACaddress: [],
    time: [
      {
        startTime: new Date("2024-02-09 08:00:00"),
        endTime: new Date("2024-02-09 09:00:00"),
      },
    ],
  };
};

export const onUpload = (e: any): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const file = e;
    if (!file) reject("No file selected");

    const targetSize = 500 * 1024; // 500 kb
    let quality = 1;

    const compressFile = async (compressionQuality: number) => {
      return new Promise<void>((resolve, reject) => {
        new Compressor(file, {
          quality: compressionQuality,
          async success(result) {
            e = new File([result], e.name);
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
        if (e.size < targetSize) {
          const reader = new FileReader();
          reader.readAsDataURL(e);
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

export const rotate = (base64Image: string, deg: number) => {
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = base64Image;
    img.onload = function () {
      // Rotate the image
      canvas.width = img.height;
      canvas.height = img.width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const fileType = base64Image.substring(5, base64Image.indexOf(";"));

      // Convert the rotated image to base64
      const imageDataUrl = canvas.toDataURL(fileType, 1.0);
      resolve(imageDataUrl);
    };
  });
};

export const setFieldPoster = (data: Poster[]) => {
  data.forEach((e: Poster) => {
    e.createdAt = new Date(e.createdAt);
    e.updatedAt = new Date(e.updatedAt);
    e.startDate = new Date(e.startDate);
    e.endDate = new Date(e.endDate);
    e.startTime = new Date(e.startTime);
    e.endTime = new Date(e.endTime);
    const users = store.getters.getUserById(e.id);
    const uploader = `${users.firstName} ${users?.lastName?.charAt(0) || ""}.`;
    e.uploader = uploader;

    if (e.image.length > 1) {
      e.type = "Collection";
    } else e.type = "Individual";
  });
};

export const statusPoster = [
  { status: "Displayed", severity: "success" },
  { status: "Awaited", severity: "info" },
  { status: "Expired", severity: "danger" },
];
export const statusEmer = [
  { status: "Inactive", severity: "secondary" },
  { status: "Active", severity: "success" },
];

export const createUnique = (data: Poster[]) => {
  store.state.uniquePosters = data.reduce((acc: any[], e: Poster) => {
    // Check if the title is not already in the accumulator
    if (!acc.some((poster) => poster.title === e.title)) {
      const currentDate = new Date();
      let status = "";
      if (
        dateFormatter(currentDate) >= dateFormatter(e.startDate) &&
        dateFormatter(currentDate) <= dateFormatter(e.endDate)
      ) {
        if (
          new Date().toTimeString() >= e.startTime.toTimeString() &&
          new Date().toTimeString() <= e.endTime.toTimeString()
        ) {
          status = "Displayed";
        } else {
          status = "Awaited";
        }
      } else if (currentDate < e.startDate) {
        status = "Awaited";
      } else {
        status = "Expired";
      }
      if (store.state.userInfo.isAdmin) {
        acc.push({
          title: e.title,
          posterId: e.posterId,
          uploader: e.uploader,
          createdAt: e.createdAt,
          status,
        });
      } else if (e.id == store.state.userInfo.id) {
        acc.push({
          title: e.title,
          posterId: e.posterId,
          uploader: e.uploader,
          createdAt: e.createdAt,
          status,
        });
      }
    }
    return acc;
  }, []);
};

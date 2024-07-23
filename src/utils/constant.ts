import router from "@/router";
import store from "@/store";
import { Device, Display, Emergency, Poster } from "@/types";
import axios from "axios";
import Compressor from "compressorjs";
import { CONTENT_CODE, MAP_TYPE } from "./enum";

export const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
export const checkTokenExpired = async (token: string) => {
  try {
    const decode = await JSON.parse(atob(token.split(".")[1]));
    // check email
    if (decode.email.includes(store.state.userInfo.email)) {
      // check expired
      if (decode.exp * 1000 < new Date().getTime()) {
        return "Link Expired.";
      } else {
        return "Success";
      }
    }
    return "Invalid Token.";
  } catch (err) {
    // token invalid
    return "Invalid Token.";
  }
};
export const calculateScreenHeight = (multiplier: number) => {
  const screenHeight = window.innerHeight;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
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

export const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const dateFormatter = (
  date: Date | null | undefined,
  format?: number
) => {
  if (!date) return "";

  const day = date.getDate().toString();
  const dayName = dayOfWeek[date.getDay()];
  const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
  const monthFullStr = fullMonth[date.getMonth()];
  const monthStr = month[date.getMonth()];
  const year = date.getFullYear();

  switch (format) {
    case 1:
      return `${day}/${monthNum}/${year}`; // 22/11/2023
    case 2:
      return `${day} ${monthFullStr} ${year}`; //22 November 2023
    case 3:
      return `${dayName} ${day} ${monthStr}`; //Mon 22 Nov
    case 4:
      return `${dayName}, ${day} ${monthStr} ${year}`; // Tue, 14 Jul 2024
    default:
      return `${day} ${monthStr} ${year}`; //22 Nov 2023;
  }
};

export const timeFormatter = (
  date: Date | null | undefined,
  includesSec?: boolean
) => {
  if (!date) return "";

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const secounds = date.getSeconds().toString().padStart(2, "0");
  if (!includesSec) return `${hours}:${minutes}`;
  return `${hours}:${minutes}:${secounds}`;
};

export const initialFormDevice = {
  MACaddress: undefined,
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
        startTime: new Date("1970-01-01 08:00:00"),
        endTime: new Date("1970-01-01 09:00:00"),
      },
    ],
  };
};

export const convertUrlToFile = async (url: string): Promise<any> => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  let binary = "";
  const bytes = new Uint8Array(response.data);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = window.btoa(binary);
  const contentType = response.headers["content-type"];
  const name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));
  const type = name.substring(name.lastIndexOf("."));
  const size = (base64Data.length * 3) / 4;

  return {
    dataURL: `data:${contentType};base64,${base64Data}`,
    lastModified: new Date().getTime(),
    lastModifiedDate: new Date(),
    name,
    size,
    type,
  };
};

export const onUpload = (e: any, posType: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!e) reject("No file selected");

    const type = e.type;
    let quality = 1;

    const compressFile = async (compressionQuality: number) => {
      return new Promise<any>((resolve, reject) => {
        new Compressor(e, {
          quality: compressionQuality,
          async success(result) {
            resolve(result);
          },
          error(error) {
            reject(error);
          },
        });
      });
    };

    const compressLoop = async () => {
      quality *= 0.4;
      if (posType !== CONTENT_CODE.Video) {
        try {
          e = await compressFile(quality);
        } catch (error) {
          reject(error);
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        resolve({ ...e, size: e.size, type, dataURL });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(e);
    };

    compressLoop();
  });
};

export const rotate = (dataURL: string, deg: number) => {
  return new Promise<string>((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = dataURL;
    img.onload = function () {
      // Rotate the image
      canvas.width = img.height;
      canvas.height = img.width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const fileType = dataURL.substring(5, dataURL.indexOf(";"));

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
    e.startDate = new Date(new Date(e.startDate).setHours(23, 59, 59, 0));
    e.endDate = new Date(new Date(e.endDate).setHours(23, 59, 59, 0));
    e.startTime = new Date(new Date(e.startTime).setDate(1));
    e.endTime = new Date(new Date(e.endTime).setDate(1));

    if (!router.currentRoute.value.path.includes("/device/")) {
      if (e.id) {
        const users = store.getters.getUserById(e.id);
        const uploader = `${users.firstName} ${users.lastName}`;
        e.uploader = uploader;
      }
    }
  });
  data.sort(
    (a: Poster, b: Poster) => a.createdAt.getTime() - b.createdAt.getTime()
  );
};

export const typePoster = [
  { type: MAP_TYPE.POSTER, severity: "poster", icon: "images" },
  { type: MAP_TYPE.VIDEO, severity: "video", icon: "video" },
  { type: MAP_TYPE.WEBVIEW, severity: "webview", icon: "link" },
];
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
      const currentDate = new Date(new Date().setHours(23, 59, 59, 0));
      const currentTime = new Date(
        1970,
        0,
        1,
        new Date().getHours(),
        new Date().getMinutes()
      );

      let status = "";
      if (
        currentDate.getTime() >= e.startDate.getTime() &&
        currentDate.getTime() <= e.endDate.getTime()
      ) {
        if (
          e.startTime.getTime() <= currentTime.getTime() &&
          currentTime.getTime() <= e.endTime.getTime()
        ) {
          status = "Displayed";
        } else {
          status = "Awaited";
        }
      } else if (currentDate.getTime() <= e.startDate.getTime()) {
        status = "Awaited";
      } else {
        status = "Expired";
      }

      acc.push({
        title: e.title,
        id: e.id,
        posterId: e.posterId,
        uploader: e.uploader,
        createdAt: e.createdAt,
        type: e.type.charAt(0) + e.type.slice(1).toLowerCase(),
        status,
      });
    }
    return acc;
  }, []);
};

export const setNorForm = (data: any) => {
  if (store.state.posters?.length) {
    store.state.editPoster.title = data.title;
    const poster = store.state.posters.filter((e) => e.title === data.title);
    poster.sort((a: Poster, b: Poster) => {
      if (a.startDate < b.startDate) return -1;
      else if (a.startDate > b.startDate) return 1;
      else {
        if (a.startTime < b.startTime) return -1;
        else if (a.startTime > b.startTime) return 1;
        else return 0;
      }
    });

    // poster form
    const form = {
      posterId: data.posterId,
      title: data.title,
      description: poster[0].description,
      type: data.type,
      image: JSON.parse(JSON.stringify(poster[0].image)),
    } as Poster;
    store.state.formPoster = { ...form };

    // display form
    store.state.formDisplay.pop();
    poster.forEach((e: any) => {
      const index = store.state.formDisplay.findIndex(
        (disp) =>
          disp.startDate!.getTime() === e.startDate.getTime() &&
          disp.endDate!.getTime() === e.endDate.getTime()
      );

      if (index === -1) {
        const last = store.state.formDisplay.length;
        store.state.formDisplay.push(newInitialFormDisplay());
        store.state.formDisplay[last].startDate = e.startDate;
        store.state.formDisplay[last].endDate = e.endDate;
        store.state.formDisplay[last].duration = e.duration;
        store.state.formDisplay[last].MACaddress.push(e.MACaddress);
        if (e.startTime.getHours() === 0 && e.endTime.getHours() === 23) {
          store.state.formDisplay[last].allDay = true;
        } else {
          store.state.formDisplay[last].time.pop();
          store.state.formDisplay[last].time.push({
            startTime: e.startTime,
            endTime: e.endTime,
          });
        }
      } else {
        if (!store.state.formDisplay[index].MACaddress.includes(e.MACaddress)) {
          store.state.formDisplay[index].MACaddress.push(e.MACaddress);
        }
        if (
          store.state.formDisplay[index].time.findIndex(
            (time) =>
              time.startTime?.getTime() === e.startTime.getTime() &&
              time.endTime?.getTime() === e.endTime.getTime()
          ) === -1
        ) {
          store.state.formDisplay[index].time.push({
            startTime: e.startTime,
            endTime: e.endTime,
          });
        }
      }
    });

    store.state.formDisplay.forEach((e) => {
      if (e.MACaddress.length === store.state.devices?.length) {
        e.MACaddress = [];
        e.allDevice = true;
      }
    });

    store.state.editPoster.code = CONTENT_CODE[form.type];
    store.state.showUpload = true;
  }
};

export const setEmerForm = (data: any) => {
  store.state.editPoster.title = data.incidentName;
  store.state.formEmer = {
    ...data,
    emergencyImage: { ...data.emergencyImage },
    status: data.status === "Active" ? true : false,
  };
  store.state.editPoster.code = "EP";
  store.state.showUpload = true;
};

let currentIndexPoster = 0;
let currentIndexImage = 0;
let count = 0;

export const loopPoster = (posters: Poster[], emerPoster?: Emergency) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const updatePosterInterval = () => {
    if (!store.state.posters?.length) {
      return;
    }
    const currentTime = new Date(
      1970,
      0,
      1,
      new Date().getHours(),
      new Date().getMinutes()
    );
    const currentPoster = posters[currentIndexPoster];
    if (
      currentPoster &&
      currentPoster.startTime.getTime() <= currentTime.getTime() &&
      currentPoster.endTime.getTime() >= currentTime.getTime()
    ) {
      if (emerPoster) return;

      store.state.currentImage.image =
        currentPoster.image[currentIndexImage].image;
      store.state.currentImage.key =
        currentPoster.title + currentPoster.image[currentIndexImage].priority;
      store.state.currentImage.type = currentPoster.type;

      timeoutId = setTimeout(() => {
        currentIndexImage = currentIndexImage + 1;
        if (currentIndexImage === currentPoster.image.length) {
          currentIndexImage = 0;
          currentIndexPoster = (currentIndexPoster + 1) % posters.length;
        }
        updatePosterInterval();
      }, currentPoster.duration * 1000 + 500);
    } else {
      if (!currentPoster) {
        currentIndexImage = 0;
        currentIndexPoster = (currentIndexPoster + 1) % posters.length;
      }
      currentIndexPoster = findNextValidPosterIndex();
      updatePosterInterval();
    }
  };

  const findNextValidPosterIndex = () => {
    const currentTime = new Date(
      1970,
      0,
      1,
      new Date().getHours(),
      new Date().getMinutes()
    ).getTime();
    currentIndexPoster = (currentIndexPoster + 1) % posters.length;
    const poster = posters[currentIndexPoster];
    if (count > posters.length) return -1;
    else if (
      poster.startTime &&
      poster.startTime.getTime() <= currentTime &&
      poster.endTime.getTime() >= currentTime
    ) {
      count = 0;
      return currentIndexPoster;
    } else {
      count++;
      findNextValidPosterIndex();
    }
    return currentIndexPoster;
  };

  updatePosterInterval();

  const stopLoop = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    return;
  };

  return stopLoop;
};

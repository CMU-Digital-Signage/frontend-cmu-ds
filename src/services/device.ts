import store from "@/store";
import { Device } from "@/types";
import {
  color,
  convertImageToBase64,
  convertUrlToFile,
} from "@/utils/constant";
import axios from "axios";

export async function getDevice() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/device`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      withCredentials: true,
    });

    // res.data.data.forEach(async (e: Device) => {
    //   const url = e.location;
    //   const response = await convertImageToBase64(url);
    //   const base64Data = response.split(",")[1];
    //   const name = url.substring(
    //     url.lastIndexOf("/") + 1,
    //     url.lastIndexOf("?")
    //   );
    //   const type = name.substring(name.lastIndexOf("."));
    //   const size = (base64Data.length * 3) / 4;

    //   e.location = {
    //     dataURL: `data:image/${type};base64,${base64Data}`,
    //     name,
    //     size,
    //     type,
    //   };
    // });

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

export async function addDevice(data: Device) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/device`,
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );

    if (store.state.devices)
      store.state.devices.push({
        ...res.data.device,
        color: color[store.state.devices.length],
      });
    store.state.macNotUse = store.state.macNotUse.filter(
      (e: string) => e !== data.MACaddress
    );
    store.state.filterDevice.push(data.MACaddress);

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

export async function editDevice(data: Device) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/device`,
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );

    if (store.state.devices) {
      const index = store.state.devices.findIndex(
        (e) => e.MACaddress === res.data.device.MACaddress
      );
      if (index !== -1) {
        store.state.devices[index] = {
          ...res.data.device,
        };
      }
    }

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

export async function deleteDevice(MACaddress: string) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/device`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { MACaddress },
        withCredentials: true,
      }
    );

    if (store.state.devices)
      store.state.devices = store.state.devices.filter(
        (e) => e.MACaddress !== MACaddress
      );

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

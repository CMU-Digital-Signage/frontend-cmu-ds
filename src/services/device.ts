import store from "@/store";
import { Device } from "@/types";
import { color, convertUrlToFile } from "@/utils/constant";
import axios from "axios";

export async function getDevice() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/device`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      withCredentials: true,
    });

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

export async function addDeviceTV(data: Device) {
  try {
    const res = await axios.post(
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
      res.data.device.location = data.location;
      store.state.devices.push({
        ...res.data.device,
        color: color[store.state.devices.length],
      });
      store.state.filterDevice.push(data.MACaddress!);
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

export async function addDevicePi(data: Device) {
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
      res.data.device.location = data.location;
      store.state.devices.push({
        ...res.data.device,
        color: color[store.state.devices.length],
      });
      store.state.macNotUse = store.state.macNotUse.filter(
        (e: string) => e !== data.MACaddress
      );
      store.state.filterDevice.push(data.MACaddress!);
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
      res.data.device.location = data.location;
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

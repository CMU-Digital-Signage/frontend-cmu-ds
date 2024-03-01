import store from "@/store";
import { Device } from "@/types";
import { color } from "@/utils/constant";
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
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function addDevice(data: Device) {
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

    store.state.devices.push({
      ...data,
      status: false,
      color: color[store.state.devices.length],
    });
    store.state.macNotUse = store.state.macNotUse.filter(
      (e: any) => e !== data.MACaddress
    );
    store.state.filterDevice.push(data.MACaddress);

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
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

    const index = store.state.devices.findIndex(
      (e) => e.MACaddress === data.MACaddress
    );
    if (index !== -1) {
      store.state.devices[index] = { ...store.state.devices[index], ...data };
    }

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
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

    store.state.devices = store.state.devices.filter(
      (e) => e.MACaddress !== MACaddress
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

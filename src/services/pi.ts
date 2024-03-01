import store from "@/store";
import axios from "axios";

export async function getPosterEachDevice(mac: string) {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/pi/poster`,
      {
        params: { mac },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function getActivateEmerPoster() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/pi/poster/emergency`,
      {
        withCredentials: true,
      }
    );

    store.state.emerPosters = res.data.emergency;

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function turnOnDevice(mac: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/pi/on`,
      {},
      {
        params: { mac },
        withCredentials: true,
      }
    );

    store.state.devices.find((e) => e.MACaddress === mac)!.status = true;

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function turnOffDevice(mac: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/pi/off`,
      {},
      {
        params: { mac },
        withCredentials: true,
      }
    );

    store.state.devices.find((e) => e.MACaddress === mac)!.status = false;

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

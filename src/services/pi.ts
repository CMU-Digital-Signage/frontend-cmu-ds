import store from "@/store";
import axios from "axios";

export async function getGlanceBarEachDevice(mac: string) {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/pi/bar`, {
      params: { mac },
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return { ...err.response.data, status: err.response.status };
  }
}

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
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return { ...err.response.data, status: err.response.status };
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
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

export async function turnOnOffDevice(mac: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/pi/on_off`,
      {},
      {
        params: { mac },
        withCredentials: true,
      }
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

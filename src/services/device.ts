import store from "@/store";
import axios from "axios";

export async function getDeviceMac(mac: string) {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/device`, {
      params: {
        mac,
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

export async function getDevicePoster() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/device/poster`,
      {
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

import store from "@/store";
import { Device } from "@/types";
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

export async function addOrEditDevice(data: Device) {
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
        params: {
          MACaddress,
        },
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

import axios from "axios";
import { Emergency } from "@/types";

export async function getEmergency() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/poster/emergency`,
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

export async function addEmergency(data: Emergency) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/poster/emergency`,
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

export async function editEmergency(data: Emergency) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/poster/emergency`,
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          incidentName: data.incidentName,
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

export async function deleteEmergency(incidentName: string) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/poster/emergency`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { incidentName },
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

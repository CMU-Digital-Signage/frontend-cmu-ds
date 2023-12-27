import router from "@/router";
import store from "@/store";
import axios from "axios";

export async function getAdmin() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/admin`, {
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

export async function addAdmin(email: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/admin`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          email,
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

export async function deleteAdmin(email: string) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/admin`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          email,
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

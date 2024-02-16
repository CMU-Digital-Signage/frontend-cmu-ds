import router from "@/router";
import store from "@/store";
import { User } from "@/types";
import axios from "axios";

export async function getUserInfo() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user`, {
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

export async function getAllUser() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/user/all`,
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

export async function setPassword(password: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user`,
      {
        password,
      },
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

export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/user`,
      {
        oldPassword,
        newPassword
      },
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

export function signOut() {
  localStorage.removeItem("token");
  store.state.userInfo = <User>{};
  router.replace("/login");
}

import router from "@/router";
import store from "@/store";
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

export function signOut() {
  localStorage.removeItem("token");
  store.commit("clearUser");
  router.replace("/login");
}
<<<<<<< HEAD


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

export async function addAdmin() {
  try {
    const res = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/add`,
      {
        
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
=======
>>>>>>> 14efc6c68c71d7e93c5cdee43b7bda2d446e7b43

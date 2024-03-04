import store from "@/store";
import axios from "axios";

export async function addAdmin(email: string) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/admin`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { email },
        withCredentials: true,
      }
    );

    if (store.state.allUser) store.state.allUser.push(res.data.admin);

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

export async function deleteAdmin(id: number) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/admin`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id,
        },
        withCredentials: true,
      }
    );

    if (store.state.allUser) {
      store.state.allUser.find(
        (e) => e.email === res.data.user.email
      )!.isAdmin = false;
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

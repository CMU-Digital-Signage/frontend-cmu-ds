import store from "@/store";
import axios from "axios";

export async function getPoster(title: string) {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/poster`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      params: { title },
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

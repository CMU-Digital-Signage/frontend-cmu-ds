import { Poster, Display } from "@/types";
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

export async function addPoster(poster: Poster, display: Display[]) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/poster`,
      {
        poster,
        display,
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

export async function editPoster(poster: Poster, display: Display[]) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/poster`,
      {
        poster,
        display,
      },
      {
        params: { posterId: poster.posterId },
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

export async function deletePoster(posterId: string) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/poster`,
      {
        params: { posterId },
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

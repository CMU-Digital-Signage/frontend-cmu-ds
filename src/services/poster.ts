import store from "@/store";
import { Poster, Display } from "@/types";
import { createUnique, setFieldPoster } from "@/utils/constant";
import axios from "axios";

export async function searchPoster(title: string) {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/poster/search`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { title },
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

export async function getPoster() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/poster`, {
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

    setFieldPoster(res.data.newPoster);
    store.state.posters.push(...res.data.newPoster);
    createUnique(store.state.posters);

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

    setFieldPoster(res.data.updatePoster);
    store.state.posters = store.state.posters.filter(
      (e) => e.posterId !== res.data.updatePoster[0].posterId
    );
    store.state.posters.push(...res.data.updatePoster);
    createUnique(store.state.posters);

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

    store.state.posters = store.state.posters.filter(
      (e) => e.posterId !== posterId
    );
    store.state.uniquePosters = store.state.uniquePosters.filter(
      (e) => e.posterId !== posterId
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

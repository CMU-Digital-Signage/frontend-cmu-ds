import axios from "axios";

export async function getIframe(url: string) {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/proxy`, {
      params: { url },
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return { ...err.response.data, status: err.response.status };
  }
}

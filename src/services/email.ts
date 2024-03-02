import axios from "axios";

export async function sendEmail() {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/email`,
      {
        link: process.env.VUE_APP_WEB_APP,
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
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

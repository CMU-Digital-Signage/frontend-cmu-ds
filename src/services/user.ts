import axios from "axios";

export async function getUserInfo() {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user`, {
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

export async function signOut() {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/signOut`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    return "Cannot connect to API Server. Please try again later.";
  }
}

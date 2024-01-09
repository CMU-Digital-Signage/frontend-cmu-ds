import axios from "axios";

export async function addAdmin({
  id,
  firstName,
  lastName,
}: {
  id?: number;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/admin`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id,
          firstName,
          lastName,
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

    return res.data;
  } catch (err: any) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

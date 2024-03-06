import axios from "axios";
import { Emergency } from "@/types";
import store from "@/store";
import { convertUrlToFile } from "@/utils/constant";

const prefix = "/poster";

export async function getEmergency() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}${prefix}/emergency`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );

    convertUrlToFile(res.data.emergency);

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

export async function addEmergency(data: Emergency) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}${prefix}/emergency`,
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },

        withCredentials: true,
      }
    );
    if (store.state.emerPosters) {
      convertUrlToFile(res.data.emergency);
      store.state.emerPosters.push({
        ...res.data.emergency,
        status: res.data.emergency.status ? "Active" : "Inactive",
      });
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

export async function editEmergency(
  incidentName: string,
  data: Emergency,
  password?: string
) {
  try {
    const res = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}${prefix}/emergency`,
      {
        ...data,
        password: password,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { incidentName },
        withCredentials: true,
      }
    );
    if (store.state.emerPosters && store.state.devices) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === incidentName
      );
      if (index !== -1) {
        if (incidentName !== "banner") convertUrlToFile(res.data.emergency);
        store.state.emerPosters[index] = {
          ...res.data.emergency,
          status: res.data.emergency.status ? "Active" : "Inactive",
        };
      }
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

export async function deleteEmergency(incidentName: string) {
  try {
    const res = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}${prefix}/emergency`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { incidentName },
        withCredentials: true,
      }
    );
    if (store.state.emerPosters)
      store.state.emerPosters = store.state.emerPosters.filter(
        (e) => e.incidentName !== incidentName
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

export async function activateEmergency(
  incidentName: string,
  password: string
) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}${prefix}/emergency/activate`,
      {
        password,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { incidentName },
        withCredentials: true,
      }
    );

    if (store.state.emerPosters) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === incidentName
      );
      if (index !== -1) store.state.emerPosters[index].status = "Active";
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

export async function deactivateEmergency(
  incidentName: string,
  password: string
) {
  try {
    const res = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/poster/emergency/deactivate`,
      {
        password,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: { incidentName },
        withCredentials: true,
      }
    );

    if (store.state.emerPosters) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === incidentName
      );
      if (index !== -1) {
        if (incidentName === "banner") {
          store.state.emerPosters[index].emergencyImage = "";
        }
        store.state.emerPosters[index].status = "Inactive";
      }
    }

    return res.data;
  } catch (err: any) {
    console.log(err);

    if (!err.response) {
      return {
        message: "Cannot connect to API Server. Please try again later.",
      };
    }
    return err.response.data;
  }
}

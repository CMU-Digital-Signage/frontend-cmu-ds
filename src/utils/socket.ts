import io from "socket.io-client";
import store from "@/store";
import { Device, Emergency, Poster, User } from "@/types";
import router from "@/router";
import { color, createUnique, setFieldPoster } from "./constant";

export const socket = io(process.env.VUE_APP_API_BASE_URL!, {
  transports: ["websocket"],
});

export default function setupSocket() {
  // user
  socket.on("addAdmin", (data: User) => {
    if (
      store.state.allUser &&
      !store.state.allUser.filter((e) => e.id === data.id)
    )
      store.state.allUser.push(data);
  });
  socket.on("updateUser", (data: User) => {
    store.state.allUser?.find((e) => {
      if (e.email === data.email) e = { ...data };
    });
  });
  socket.on("deleteAdmin", (data: User) => {
    if (store.state.allUser)
      store.state.allUser.find((e) => e.email === data.email)!.isAdmin = false;
  });

  // pi
  socket.on("addPi", (data: Device) => {
    store.state.macNotUse.push(data.MACaddress);
  });
  socket.on("turnOnDevice", (mac: string) => {
    if (store.state.devices)
      store.state.devices.find((e) => e.MACaddress === mac)!.status = true;
  });
  socket.on("turnOffDevice", (mac: string) => {
    if (store.state.devices)
      store.state.devices.find((e) => e.MACaddress === mac)!.status = false;
  });

  // device
  socket.on("addDevice", (data: Device) => {
    if (
      store.state.devices &&
      !store.state.devices.filter((e) => e.MACaddress === data.MACaddress)
    ) {
      store.state.devices.push({
        ...data,
        color: color[store.state.devices.length],
      });
      store.state.filterDevice.push(data.MACaddress);
    }
    store.state.macNotUse = store.state.macNotUse.filter(
      (e: any) => e !== data.MACaddress
    );
  });
  socket.on("updateDevice", (data: Device) => {
    if (store.state.devices) {
      const index = store.state.devices.findIndex(
        (e) => e.MACaddress === data.MACaddress
      );
      if (index !== -1) {
        store.state.devices[index] = { ...store.state.devices[index], ...data };
      }
    }
  });
  socket.on("deleteDevice", (data: Device) => {
    if (store.state.devices)
      store.state.devices = store.state.devices.filter(
        (e) => e.MACaddress !== data.MACaddress
      );
  });

  // emergency
  socket.on("addEmergency", (data: Emergency) => {
    if (
      store.state.emerPosters &&
      !store.state.emerPosters.filter(
        (e) => e.incidentName !== data.incidentName
      )
    )
      store.state.emerPosters.push({
        ...data,
        status: data.status ? "Active" : "Inactive",
      });
  });
  socket.on("updateEmergency", (incidentName, data: Emergency) => {
    if (store.state.emerPosters) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === incidentName
      );
      if (index !== -1) {
        store.state.emerPosters[index] = {
          ...data,
          status: data.status ? "Active" : "Inactive",
        };
      }
      const mac = router.currentRoute.value.params.mac as string;
      if (data.status && mac) {
        store.state.emerPosters.push({ ...data });
      }
    }
  });
  socket.on("deleteEmergency", (data: Emergency) => {
    if (store.state.emerPosters)
      store.state.emerPosters = store.state.emerPosters.filter(
        (e) => e.incidentName !== data.incidentName
      );
  });

  // activate emergency
  socket.on("activate", async (data: Emergency) => {
    const mac = router.currentRoute.value.params.mac as string;
    if (mac && store.state.emerPosters) {
      store.state.emerPosters.push({ ...data });
    } else if (store.state.emerPosters) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === data.incidentName
      );
      if (index !== -1) store.state.emerPosters[index].status = "Active";
    }
  });
  // deactivate emergency
  socket.on("deactivate", (data: Emergency) => {
    const mac = router.currentRoute.value.params.mac as string;
    if (mac && store.state.emerPosters) {
      store.state.emerPosters.pop();
    } else if (store.state.emerPosters) {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === data.incidentName
      );
      if (index !== -1) {
        store.state.emerPosters[index].emergencyImage = data.emergencyImage;
        store.state.emerPosters[index].status = "Inactive";
      }
    }
  });

  // poster
  socket.on("addPoster", (data: Poster[]) => {
    setFieldPoster(data);
    if (store.state.posters) {
      if (!store.state.posters.filter((e) => e.posterId !== data[0].posterId))
        store.state.posters.push(...data);
      createUnique(store.state.posters);
    }
  });
  socket.on("updatePoster", (data: Poster[]) => {
    setFieldPoster(data);
    if (store.state.posters) {
      store.state.posters = store.state.posters.filter(
        (e) => e.posterId !== data[0].posterId
      );
      store.state.posters.push(...data);
      createUnique(store.state.posters);
    }
  });
  socket.on("deletePoster", (data: Poster) => {
    if (store.state.posters)
      store.state.posters = store.state.posters.filter(
        (e) => e.title !== data.posterId
      );
    store.state.uniquePosters = store.state.uniquePosters?.filter(
      (e) => e.title !== data.posterId
    );
  });
}

import io from "socket.io-client";
import store from "@/store";
import { Device, Emergency, Poster, User } from "@/types";
import router from "@/router";
import { createUnique, setFieldPoster } from "./constant";

export const socket = io(process.env.VUE_APP_API_BASE_URL!, {
  transports: ["websocket"],
});

export default function setupSocket() {
  // user
  socket.on("addAdmin", (data: User) => {
    store.state.allUser.push(data);
  });
  socket.on("updateUser", (data: User) => {
    store.state.allUser.find((e) => {
      if (e.email === data.email) e = { ...data };
    });
  });
  socket.on("deleteAdmin", (data: User) => {
    store.state.allUser.find((e) => e.email === data.email)!.isAdmin = false;
  });

  // pi
  socket.on("addPi", (data: Device) => {
    store.state.macNotUse.push(data.MACaddress);
  });
  socket.on("turnOnDevice", (mac: string) => {
    store.state.devices.find((e) => e.MACaddress === mac)!.status = true;
  });
  socket.on("turnOffDevice", (mac: string) => {
    store.state.devices.find((e) => e.MACaddress === mac)!.status = false;
  });

  // device
  socket.on("addDevice", (data: Device) => {
    store.state.devices.push({ ...data });
    store.state.macNotUse = store.state.macNotUse.filter(
      (e: any) => e !== data.MACaddress
    );
  });
  socket.on("updateDevice", (data: Device) => {
    const index = store.state.devices.findIndex(
      (e) => e.MACaddress === data.MACaddress
    );
    if (index !== -1) {
      store.state.devices[index] = { ...store.state.devices[index], ...data };
    }
  });
  socket.on("deleteDevice", (data: Device) => {
    store.state.devices = store.state.devices.filter(
      (e) => e.MACaddress !== data.MACaddress
    );
  });

  // emergency
  socket.on("addEmergency", (data: Emergency) => {
    store.state.emerPosters.push({
      ...data,
      status: data.status ? "Active" : "Inactive",
    });
  });
  socket.on("updateEmergency", (incidentName, data: Emergency) => {
    const index = store.state.emerPosters.findIndex(
      (e) => e.incidentName === incidentName
    );
    if (index !== -1) {
      store.state.emerPosters[index] = {
        ...store.state.devices[index],
        ...data,
        status: data.status ? "Active" : "Inactive",
      };
    }
  });
  socket.on("deleteEmergency", (data: Emergency) => {
    store.state.emerPosters = store.state.emerPosters.filter(
      (e) => e.incidentName !== data.incidentName
    );
  });

  // activate emergency
  socket.on("activate", async (data: Emergency) => {
    const mac = router.currentRoute.value.params.mac as string;
    if (mac) {
      store.state.emerPosters.push({ ...data });
    } else {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === data.incidentName
      );
      if (index !== -1) store.state.emerPosters[index].status = "Active";
    }
  });
  // deactivate emergency
  socket.on("deactivate", (data: Emergency) => {
    const mac = router.currentRoute.value.params.mac as string;
    if (mac) {
      store.state.emerPosters.pop();
    } else {
      const index = store.state.emerPosters.findIndex(
        (e) => e.incidentName === data.incidentName
      );
      if (index !== -1) store.state.emerPosters[index].status = "Inactive";
    }
  });

  // poster
  socket.on("addPoster", (data: Poster[]) => {
    setFieldPoster(data);
    store.state.posters.push(...data);
    // createUnique(posters.value);
  });
  socket.on("updatePoster", (data: Poster[]) => {
    // const index = store.state.posters.findIndex(
    //   (e) => e.posterId === data.posterId
    // );
    // if (index !== -1) {
    //   store.state.posters[index] = {
    //     ...store.state.devices[index],
    //     ...data,
    //   };
    // }
  });
  socket.on("deletePoster", (data: Poster) => {
    store.state.posters = store.state.posters.filter(
      (e) => e.title !== data.title
    );
    store.state.uniquePosters = store.state.uniquePosters.filter(
      (e) => e.title !== data.title
    );
  });
}

import { Device, Display, Emergency, Poster, User } from "@/types";
import { newInitialFormDisplay, fullMonth } from "@/utils/constant";
import { createStore } from "vuex";

const date = new Date();

export default createStore({
  state: {
    currentImage: { key: "", image: "" },
    openSidebar: true,
    loading: false,
    showUpload: false,
    viewType: true,
    userInfo: <User>{},
    allUser: <User[]>[],
    selectTabview: <number>0,
    selectDevice: <string>"",
    currentViewDate: <string>(
      `${fullMonth[date.getMonth()]} ${date.getFullYear()}`
    ),
    macNotUse: <any>[],
    devices: <Device[]>[],
    posters: <Poster[]>[],
    emerPosters: <Emergency[]>[],
    uniquePosters: <Poster[]>[],
    searchPosters: <Poster[] | null>null,
    editPoster: { title: "", type: "" },
    filterInputPosters: {
      title: "",
      uploader: "",
      uploadDate: undefined as Date | undefined,
      status: "" as string,
      date: new Date() as Date,
      time: new Date() as Date,
    },
    filterDevice: <(string | null)[]>[],
    formPoster: <Poster>{},
    formDisplay: <Display[]>[newInitialFormDisplay()],
    formEmer: <Emergency>{},
  },
  getters: {
    getUserById: (state) => (id: string) => {
      return state.allUser.find((user) => user.id === id) || {};
    },
    getDeviceByMac: (state) => (mac: string) => {
      return (
        state.devices.find((device) => device.MACaddress === mac)?.deviceName ||
        {}
      );
    },
  },
  mutations: {
    setAdmin(state, { id, isAdmin }) {
      state.allUser.find((e) => (e.id === id ? (e.isAdmin = isAdmin) : ""));
    },
    resetFilter(state) {
      state.filterInputPosters = {
        title: "",
        uploader: "",
        uploadDate: undefined,
        status: "",
        date: new Date(),
        time: new Date(),
      };
    },
    setAllTime(state, index) {
      state.formDisplay[index].time = [
        {
          startTime: new Date("2024-01-01T00:00:00"),
          endTime: new Date("2024-01-01T23:59:59"),
        },
      ];
    },
    setAllDevice(state, index) {
      state.devices.map((e) => {
        if (!state.formDisplay[index].MACaddress.includes(e.MACaddress!))
          state.formDisplay[index].MACaddress.push(e.MACaddress!);
      });
    },
    resetForm(state) {
      state.formPoster = <Poster>{};
      state.formDisplay = <Display[]>[newInitialFormDisplay()];
      state.formEmer = <Emergency>{};
    },
  },
  actions: {},
  modules: {},
});

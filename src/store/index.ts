import { Device, Display, Emergency, Poster, User } from "@/types";
import { newInitialFormDisplay, fullMonth } from "@/utils/constant";
import { TYPE } from "@/utils/enum";
import { createStore } from "vuex";

const date = new Date();

export default createStore({
  state: {
    currentImage: { key: "", image: null, type: "" },
    openSidebar: true,
    loading: false,
    showUpload: false,
    viewType: true,
    userInfo: <User>{},
    allUser: <User[] | undefined>undefined,
    selectTabview: <number>0,
    selectDevice: <string>"",
    currentViewDate: <string>(
      `${fullMonth[date.getMonth()]} ${date.getFullYear()}`
    ),
    macNotUse: <any>[],
    devices: <Device[] | undefined>undefined,
    posters: <Poster[] | undefined>undefined,
    emerPosters: <Emergency[] | undefined>undefined,
    uniquePosters: <Poster[] | undefined>undefined,
    searchPosters: <Poster[] | undefined>undefined,
    editPoster: { title: "", code: "" },
    filterInputPosters: {
      title: "",
      uploader: "",
      uploadDate: undefined as Date | undefined,
      type: null as TYPE | null,
      status: "" as string,
      date: new Date(new Date().setHours(23, 59, 59, 0)) as Date,
      time: new Date(
        1970,
        0,
        1,
        new Date().getHours(),
        new Date().getMinutes()
      ) as Date,
    },
    filterDevice: <(string | null)[]>[],
    formPoster: <Poster>{},
    formDisplay: <Display[]>[newInitialFormDisplay()],
    formEmer: <Emergency>{},
  },
  getters: {
    getUserById: (state) => (id: string) => {
      return state.allUser?.find((user) => user.id === id) || undefined;
    },
    getDeviceByMac: (state) => (mac: string) => {
      return (
        state.devices?.find((device) => device.MACaddress === mac)
          ?.deviceName || undefined
      );
    },
  },
  mutations: {
    setAdmin(state, { id, isAdmin }) {
      state.allUser?.find((e) => (e.id === id ? (e.isAdmin = isAdmin) : ""));
    },
    resetFilter(state) {
      state.filterInputPosters = {
        title: "",
        uploader: "",
        uploadDate: undefined,
        type: null,
        status: "",
        date: new Date(new Date().setHours(23, 59, 59, 0)),
        time: new Date(
          1970,
          0,
          1,
          new Date().getHours(),
          new Date().getMinutes()
        ),
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
      state.devices?.map((e) => {
        if (
          e.MACaddress &&
          !state.formDisplay[index].MACaddress.includes(e.MACaddress)
        )
          state.formDisplay[index].MACaddress.push(e.MACaddress);
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

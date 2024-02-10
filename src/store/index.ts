import { Device, Display, Emergency, Poster, User } from "@/types";
import { newInitialFormDisplay, fullMonth } from "@/utils/constant";
import { createStore } from "vuex";

const date = new Date();

export default createStore({
  state: {
    openSidebar: true,
    loading: false,
    showUpload: false,
    userInfo: <User>{},
    allUser: <User[]>[],
    selectTabview: <number>0,
    selectDevice: <string>"",
    currentViewDate: <string>(
      `${fullMonth[date.getMonth()]} ${date.getFullYear()}`
    ),
    macNotUse: [],
    devices: <Device[]>[],
    posters: <Poster[]>[],
    emerPosters: <Emergency[]>[],
    uniquePosters: <Poster[]>[],
    searchPosters: <Poster[] | null>null,
    filterInputPosters: {
      title: "",
      uploader: "",
      uploadDate: undefined as Date | undefined,
      status: "" as string,
    },
    filterDevice: <(string | null)[]>[],
    formPoster: <any>{},
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
      };
    },
    // addSchedule(state) {
    //   state.formDisplay.push({ ...initialFormDisplay });
    // },
    // addTime(state, index: number) {
    //   state.formDisplay[index].time.push({
    //     startTime: undefined,
    //     endTime: undefined,
    //   });
    // },
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

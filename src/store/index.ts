import { Device, Display, Emergency, Poster, User } from "@/types";
import { initialFormDisplay } from "@/utils/constant";
import { createStore } from "vuex";

export default createStore({
  state: {
    openSidebar: true,
    userInfo: <User>{},
    allUser: <User[]>[],
    adminManage: <number>0,
    macNotUse: [],
    devices: <Device[]>[],
    posters: <Poster[]>[],
    searchPosters: <Poster[]>[],
    filterDevice: <string[]>[],
    formPoster: <Poster>{},
    formDisplay: <Display[]>[{ ...initialFormDisplay }],
    formEmer: <Emergency>{},
  },
  getters: {},
  mutations: {
    setOpenSidebar(state, value) {
      state.openSidebar = value;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    clearUser(state) {
      state.userInfo = <User>{};
    },
    setAllUser(state, value) {
      state.allUser = value;
    },
    setAdmin(state, { id, isAdmin }) {
      state.allUser.find((e) => (e.id === id ? (e.isAdmin = isAdmin) : ""));
    },
    setAdminManage(state, value) {
      state.adminManage = value;
    },
    setMacNotUse(state, mac) {
      state.macNotUse = mac;
    },
    setDevices(state, devices) {
      state.devices = devices;
    },
    setPosters(state, posters) {
      state.posters = posters;
    },
    setSearchPosters(state, posters) {
      state.searchPosters = posters;
    },
    setFilterDevice(state, mac) {
      state.filterDevice = mac;
    },
    clearSearchPosters(state) {
      state.searchPosters = [] as Poster[];
    },
    addDisplay(state, value) {
      state.formDisplay.push(value);
    },
    removeDisplay(state, index) {
      state.formDisplay.splice(index, 1);
    },
    addTime(state, payload) {
      state.formDisplay[payload.index].time.push(payload.time);
    },
    removeTime(state, payload) {
      state.formDisplay[payload.index].time.splice(payload.timeIndex, 1);
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
      state.formDisplay = <Display[]>[{ ...initialFormDisplay }];
      state.formEmer = <Emergency>{};
    },
  },
  actions: {},
  modules: {},
});

import { Device, Poster, User } from "@/types";
import { createStore } from "vuex";

export default createStore({
  state: {
    openSidebar: true,
    userInfo: <User>{
      id: 0,
      firstName: '',
      lastName: '',
      isAdmin: false
    }, 
    macNotUse: [],
    devices: <Device[]>[],
    posters: <Poster[]>[],
    searchPosters: <Poster[]>[],
    adminManage: 0 as number,
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
      state.userInfo = {} as User;
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
    clearSearchPosters(state) {
      state.searchPosters = [] as Poster[];
    },
  },
  actions: {},
  modules: {},
});

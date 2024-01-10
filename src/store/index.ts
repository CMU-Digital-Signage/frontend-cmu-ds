import { Device, Poster, User } from "@/types";
import { createStore } from "vuex";

const defaultUser = {
  id: "",
  firstName: "",
  lastName: "",
  isAdmin: false,
} as User;

export default createStore({
  state: {
    openSidebar: true,
    userInfo: defaultUser,
    allUser: <User[]>[],
    adminManage: 0 as number,
    macNotUse: [],
    devices: <Device[]>[],
    posters: <Poster[]>[],
    searchPosters: <Poster[]>[],
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
      state.userInfo = defaultUser;
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
    clearSearchPosters(state) {
      state.searchPosters = [] as Poster[];
    },
  },
  actions: {},
  modules: {},
});

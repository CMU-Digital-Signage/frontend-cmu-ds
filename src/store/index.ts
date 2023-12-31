import { Device, User } from "@/types";
import { createStore } from "vuex";

const defaultUser: User = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isAdmin: null,
};

const defaultDevice: Device[] = [
  {
    MACaddress: "",
    deviceName: "",
    room: "",
    location: null,
    description: "",
  },
];

export default createStore({
  state: {
    userInfo: defaultUser as User,
    devices: defaultDevice as Device[],
    adminManage: 0 as number,
  },
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    resetUser(state) {
      state.userInfo = defaultUser;
    },
    setAdminManage(state, value) {
      state.adminManage = value;
    },
    setDevices(state, devices) {
      state.devices = devices;
    }
  },
  actions: {},
  modules: {},
});

import { User } from "@/types";
import { createStore } from "vuex";

const defaultUser: User = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isAdmin: null,
}; 

export default createStore({
  state: {
    userInfo: defaultUser as User,
    adminManage: true,
  },
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    resetUser(state) {
      state.userInfo = defaultUser;
    },
    setAdminManage(state) {
      state.adminManage = true;
    },
    setDeviceManage(state) {
      state.adminManage = false;
    },
  },
  actions: {},
  modules: {},
});

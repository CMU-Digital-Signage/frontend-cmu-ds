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
  },
  actions: {},
  modules: {},
});

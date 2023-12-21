import { createStore } from "vuex";

const defaultUser = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isAdmin: null,
};

export default createStore({
  state: {
    userInfo: defaultUser,
  },
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    resetUser(state) {
      state.userInfo = defaultUser;
    },
  },
  actions: {},
  modules: {},
});

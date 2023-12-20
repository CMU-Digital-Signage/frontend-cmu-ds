import { createStore } from "vuex";

export default createStore({
  state: {
    userInfo: {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      isAdmin: null,
    },
  },
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {},
  modules: {},
});

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { getUserInfo } from "@/services";

(async () => {
  if (!store.state.userInfo.email) {
    const res = await getUserInfo();
    if (res.ok) {
      store.commit("setUserInfo", res.user);
    }
    else {
      router.replace("/login");
    }
  }
  createApp(App).use(store).use(router).mount("#app");
})();

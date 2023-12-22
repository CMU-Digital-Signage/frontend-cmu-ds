import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/LoginView.vue";
import cmuOAuthCallback from "@/views/cmuOAuthCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import AdminDashboard from "../views/AdminView.vue";
import store from "@/store";
import { getUserInfo } from "@/services";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideSidebar: true,
    },
  },
  {
    path: "/cmuOAuthCallback",
    name: "cmuOAuth",
    component: cmuOAuthCallback,
    meta: {
      hideSidebar: true,
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.hideSidebar && !store.state.userInfo.email) {
    const res = await getUserInfo();
    if (res.ok) {
      store.commit("setUserInfo", res.user);
      next();
    } else {
      next({ name: "Login", replace: true });
    }
  } else {
    next();
  }
});

export default router;

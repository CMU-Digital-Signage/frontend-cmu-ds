import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { getUserInfo } from "@/services";
import Login from "../views/LoginView.vue";
import cmuOAuthCallback from "@/views/cmuOAuthCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import FileManage from "../views/FileManage.vue";
import DeviceManage from "../views/DeviceView.vue";
import EmergencyManage from "../views/EmergencyView.vue";
import AdminDashboard from "../views/AdminView.vue";
import Mac from "@/views/device/[mac].vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/device/:mac",
    name: "DeviceView",
    component: Mac,
    meta: {
      hideSidebar: true,
    },
  },
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
  {
    path: "/file",
    name: "File",
    component: FileManage,
  },
  {
    path: "/deviceManage",
    name: "Device",
    component: DeviceManage,
  },
  {
    path: "/emergency",
    name: "Emergency",
    component: EmergencyManage,
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

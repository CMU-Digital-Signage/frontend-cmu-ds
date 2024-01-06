import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { getDevice, getUserInfo } from "@/services";
import Login from "../views/LoginView.vue";
import cmuOAuthCallback from "@/views/cmuOAuthCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import FileManage from "../views/FileManage.vue";
import DeviceManage from "../views/DeviceView.vue";
import EmergencyManage from "../views/EmergencyView.vue";
import SearchPage from "../views/SearchFileView.vue";
import AdminDashboard from "../views/AdminView.vue";
import UploadFile from "../views/UploadFileView.vue";
import Mac from "@/views/device/[mac].vue";
import { Device } from "@/types";

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
  {
    path: "/searchfile",
    name: "SearchFile",
    component: SearchPage,
  },
  {
    path: "/uploadfile",
    name: "UploadFile",
    component: UploadFile,
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
      const res2 = await getDevice();
      if (res2.ok) {
        const macNotUse = [] as any;
        res2.data.map((e: any) =>
          e.deviceName ? "" : macNotUse.push(e.MACaddress)
        );
        store.commit("setMacNotUse", macNotUse);
        res2.data = res2.data.filter((e: any) => e.deviceName);
        res2.data.sort((a: any, b: any) =>
          a.deviceName.localeCompare(b.deviceName)
        );
        store.commit("setDevices", res2.data);
        next();
      }
    } else {
      next({ name: "Login", replace: true });
    }
  } else {
    next();
  }
});

export default router;

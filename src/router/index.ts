import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { getAllUser, getDevice, getUserInfo } from "@/services";
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
import { getRandomColor } from "@/utils/constant";

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
    path: "/admin",
    name: "Admin",
    component: AdminDashboard,
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
  const shouldFetchData = !to.meta.hideSidebar && !store.state.devices.length;
  if (shouldFetchData) {
    if (!store.state.userInfo.id) {
      const userInfoRes = await getUserInfo();
      if (userInfoRes.ok) store.commit("setUserInfo", userInfoRes.user);
      else next({ name: "Login", replace: true });
    }

    const [allUserRes, deviceRes] = await Promise.all([
      getAllUser(),
      getDevice(),
    ]);
    store.commit("setAllUser", allUserRes.user);

    if (deviceRes.ok) {
      const macNotUse = deviceRes.data
        .filter((e: any) => !e.deviceName)
        .map((e: any) => e.MACaddress);
      store.commit("setMacNotUse", macNotUse);

      const devices: Device[] = deviceRes.data.filter((e: any) => e.deviceName);
      devices.map((e) => (e.color = getRandomColor()));
      store.commit("setDevices", devices);

      store.commit(
        "setFilterDevice",
        devices.map((e) => e.MACaddress)
      );

      if (
        (to.path === "/admin" || to.path === "/emergency") &&
        !store.state.userInfo.isAdmin
      ) {
        next({ path: "/", replace: true });
      } else next();
    } else {
      next({ path: "/login", replace: true });
    }
  } else next();
});

export default router;

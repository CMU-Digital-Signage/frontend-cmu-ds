import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { getAllUser, getDevice, getUserInfo } from "@/services";
import Login from "../views/LoginView.vue";
import cmuOAuthCallback from "@/views/cmuOAuthCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import FileManage from "../views/FileManageView.vue";
import DeviceManage from "../views/DeviceView.vue";
import EmergencyManage from "../views/EmergencyView.vue";
import EditFile from "../views/EditFileView.vue";
import SearchPage from "../views/SearchFileView.vue";
import AdminDashboard from "../views/AdminView.vue";
import UploadFile from "../views/UploadFileView.vue";
import Mac from "@/views/device/[mac].vue";
import { Device } from "@/types";
import { color } from "@/utils/constant";

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
    meta: {
      crossIconSidebar: true,
    },
  },
  {
    path: "/uploadfile",
    name: "UploadFile",
    component: UploadFile,
    meta: {
      showNavbarBelow: true,
      crossIconSidebar: true,
    },
  },
  {
    path: "/editfile",
    name: "EditFile",
    component: EditFile,
    meta: {
      showNavbarBelow: true,
      crossIconSidebar: true,
    },
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
      if (userInfoRes.ok) store.state.userInfo = userInfoRes.user;
      else next({ name: "Login", replace: true });
    }

    const [allUserRes, deviceRes] = await Promise.all([
      getAllUser(),
      getDevice(),
    ]);
    store.state.allUser = allUserRes.user;

    if (deviceRes.ok) {
      store.state.macNotUse = deviceRes.data
        .filter((e: any) => !e.deviceName)
        .map((e: any) => e.MACaddress);

      const devices: Device[] = deviceRes.data.filter((e: any) => e.deviceName);
      devices.map((e, i) => (e.color = color[i]));
      store.state.devices = devices;
      store.state.selectDevice = devices[0].MACaddress || "";
      store.state.filterDevice = devices.map((e) => e.MACaddress);

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

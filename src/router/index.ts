import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { getUserInfo } from "@/services";
import Login from "../views/LoginView.vue";
import cmuEntraIDCallback from "@/views/cmuEntraIDCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import ContentManage from "../views/ContentManageView.vue";
import DeviceManage from "../views/DeviceView.vue";
import GlanceBarManage from "../views/GlanceBarView.vue";
import EmergencyManage from "../views/EmergencyView.vue";
import SearchPage from "../views/SearchContentView.vue";
import AdminDashboard from "../views/AdminView.vue";
import Mac from "@/views/device/[mac].vue";
import Token from "@/views/reset/[token].vue";
import PosterpreView from "@/views/PosterpreView.vue";
import { checkTokenExpired } from "@/utils/constant";

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
    path: "/reset/:token",
    name: "ResetView",
    component: Token,
    meta: {
      hideSidebar: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideSidebar: false,
    },
  },
  {
    path: "/cmuEntraIDCallback",
    name: "cmuEntraID",
    component: cmuEntraIDCallback,
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
    path: "/search-content",
    name: "SearchContent",
    component: SearchPage,
    meta: {
      crossIconSidebar: true,
    },
  },
  {
    path: "/content",
    name: "Content",
    component: ContentManage,
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
    path: "/glanceBarManage",
    name: "GlanceBar",
    component: GlanceBarManage,
  },
  {
    path: "/preview/:mac",
    name: "Preview",
    component: PosterpreView,
    meta: {
      crossIconSidebar: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = await checkTokenExpired(localStorage.getItem("token")!);
  if (token == "Link Expired.") {
    localStorage.removeItem("token");
  }
  if (!localStorage.getItem("token") && ["/emergency", "/login"].includes(to.path)) {
    next();
    return;
  }
  const shouldFetchData = !to.meta.hideSidebar;
  if (shouldFetchData || to.path.includes("/reset")) {
    if (!store.state.userInfo.id) {
      const userInfoRes = await getUserInfo();
      if (userInfoRes.ok) {
        store.state.userInfo = userInfoRes.user;
        if (store.state.userInfo.isAdmin || !to.path.includes("/admin")) {
          next();
          return;
        }
        next({ path: "/", replace: true });
        return;
      }
      next({ path: "/login", replace: true });
      return;
    }
  }
  next();
});

export default router;

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/LoginView.vue";
import cmuOAuthCallback from "@/views/cmuOAuthCallbackView.vue";
import Dashboard from "../views/DashboardView.vue";
import AdminDashboard from "../views/AdminView.vue";

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

export default router;

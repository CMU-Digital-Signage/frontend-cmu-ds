<template>
  <div class="flex" v-if="!$route.meta.hideNavbar">
    <div
      class="flex flex-col h-screen p-3 shadow w-60"
      style="background-color: #f6f6f6; border: 1px solid #aaaaaa"
    >
      <div class="space-y-5 font-sf-pro">
        <div class="flex items-center">
          <p class="font-bold" style="font-size: 20px">CPE SIGNAGE</p>
        </div>

        <div class="">
          <p 
            class="flex ml-3 font-semibold"
            style="font-size: 18px; color: #282828;"
          >
            Menu
          </p>
          <ul class="pt-1 ml-3 pb-4 space-y-1 " style="font-size: 15px">
            <li class="rounded-sm ">
              <a href="#" class="flex items-center p-2 space-x-3 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <router-link to="/dashboard">Dashboar</router-link>
              </a>
            </li>
            <li class="rounded-sm">
              <a href="#" class="flex items-center p-2 space-x-3 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                  />
                </svg>

                <span>File Manager</span>
              </a>
            </li>
            <li class="rounded-sm">
              <a href="#" class="flex items-center p-2 space-x-3 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>

                <span>Device</span>
              </a>
            </li>
         
          </ul>
        </div>
      </div>
      <UserInfo />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserInfo from "@/components/UserInfo.vue";
import router from "@/router";
import store from "@/store";

export default defineComponent({
  name: "DashboardView",
  components: { UserInfo },
});
</script>

<style lang="scss">
#app {
  font-family: "SF Pro", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}

nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

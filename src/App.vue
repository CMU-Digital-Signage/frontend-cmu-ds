<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
import store from "./store";
import NavBar from "./components/NavBar.vue";
import NavbarBelow from "./components/NavbarBelowCompo.vue";
import UploadFile from "../views/UploadFileView.vue";
import { computed } from "vue";

const user = computed(() => store.state.userInfo);

</script>

<template>
  <div
    class="flex flex-row h-screen font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.email"
  >
    <SideBar />
    <div class="w-screen flex flex-col">
      <NavBar />
      <router-view />
      <div v-if="$route.path === '/uploadfile'"><NavbarBelow /></div>
    </div>
  </div>
  <router-view v-else />
</template>

<style lang="scss">
#app {
  font-family: "SF Pro", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

router-view {
  flex: 1;
}
</style>

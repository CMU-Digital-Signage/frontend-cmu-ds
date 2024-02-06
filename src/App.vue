<script setup lang="ts">
import SideBar from "./components/SideBar.vue";
import store from "./store";
import NavBar from "./components/NavBar.vue";
import NavbarBelow from "./components/NavbarBelowCompo.vue";
import { computed } from "vue";

const user = computed(() => store.state.userInfo);
</script>

<template>
  <div
    class="flex flex-row h-screen font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar class="bg-white" />
    <div class="w-screen flex flex-col bg-[#fafafa]">
      <NavBar class="bg-white" />
      <router-view class="bg-[#fafafa]" />
      <NavbarBelow v-if="$route.meta.showNavbarBelow" />
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

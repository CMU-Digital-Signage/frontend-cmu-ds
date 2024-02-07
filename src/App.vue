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

.p-component {
  font-family: "SF Pro";
}

.p-sortable-column {
  height: 20px;
  padding: 15px;
}

.p-tabview-nav-link {
  background-color: #fafafa;
}
.p-tabview-nav {
  background-color: #fafafa;
}
.p-tabview-panels {
  background-color: #fafafa;
}

.p-datatable-wrapper {
  border-color: #dbdbdb;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-width: 1px;
  border-radius: 10px;
}
.p-row-odd {
  background-color: #fafafa;
}

.p-dialog {
  border-radius: 10px;
}
</style>

<script setup lang="ts">
import store from "./store";
import { computed } from "vue";
import SideBar from "./components/SideBar.vue";
import NavBar from "./components/NavBar.vue";
import NavbarBelow from "./components/NavbarBelow.vue";
import PopupUpload from "@/components/PopupUploadCompo.vue";

const user = computed(() => store.state.userInfo);
</script>

<template>
  <div
    class="flex flex-row w-screen h-screen font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar class="bg-white" />
    <div class="w-screen flex flex-col h-full bg-[#fafafa]">
      <NavBar class="bg-white" />
      <router-view class="bg-[#fafafa] w-full" />
      <NavbarBelow v-if="$route.meta.showNavbarBelow" />
    </div>
  </div>
  <router-view v-else />
  <PopupUpload />
</template>

<style lang="scss">
#app {
  font-family: "SF Pro", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

router-view {
  flex: 1 1;
}

TabPanel {
  flex: 1;
}

Button:focus {
  box-shadow: none;
}

.p-disabled,
.p-component:disabled {
  color: #dbdbdb;
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

// running
.p-tag-success {
  background-color: #caf1d8;
  color: #188a42;
  padding: 7px;
  border-radius: 15px;
}

// expired
.p-tag-danger {
  background-color: #ffd0ce;
  color: #b32b24;
  padding: 7px;
  border-radius: 15px;
}

// upcoming
.p-tag-warning {
  background-color: #FFDDC7;
  color: #AE510F;
  padding: 7px;
  border-radius: 15px;
}

// pending
.p-tag-info {
  background-color: #D0E1FD;
  color: #5C84C4;
  padding: 7px;
  border-radius: 15px;
}
</style>

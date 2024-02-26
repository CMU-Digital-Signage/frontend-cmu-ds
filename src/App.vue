<script setup lang="ts">
import store from "./store";
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import SideBar from "./components/SideBar.vue";
import NavBar from "./components/NavBar.vue";
import router from "./router";
import setupSocket, { socket } from "./utils/socket";
import { getAllUser, getDevice, getEmergency, getPoster } from "./services";
import { color, createUnique, setFieldPoster } from "./utils/constant";
import { Device, Emergency } from "./types";

const user = computed(() => store.state.userInfo);

onMounted(() => {
  setupSocket();
});

watch(user, async () => {
  if (user.value.id) {
    const [allUserRes, deviceRes, posterRes, emerRes] = await Promise.all([
      getAllUser(),
      getDevice(),
      getPoster(),
      getEmergency(),
    ]);
    store.state.allUser = allUserRes.user;

    store.state.macNotUse = deviceRes.data
      .filter((e: any) => !e.deviceName)
      .map((e: any) => e.MACaddress);

    const devices: Device[] = deviceRes.data.filter((e: any) => e.deviceName);
    devices.map((e, i) => (e.color = color[i]));
    store.state.devices = devices;
    store.state.selectDevice = devices[0].MACaddress || "";
    store.state.filterDevice = devices.map((e) => e.MACaddress);

    setFieldPoster(posterRes.poster);
    store.state.posters = posterRes.poster;
    createUnique(store.state.posters);

    emerRes.emergency.forEach(
      (e: Emergency) => (e.status = e.status ? "Active" : "Inactive")
    );
    store.state.emerPosters = emerRes.emergency;
  }
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<template>
  <div
    class="flex flex-row w-screen h-screen md:fixed font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar class="bg-gradient-to-r from-[#f4feff] to-[#F6FDF7]" />
    <div class="w-full h-full flex flex-col bg-[#ffffff]">
      <NavBar class="bg-gradient-to-r from-[#F6FDF7] to-[#F8FDF7]" />
      <router-view class="bg-[#ffffff] w-full" />
    </div>
  </div>
  <div v-else>
    <div class="w-screen flex flex-col h-full bg-[#fafafa] md:fixed">
      <NavBar
        v-if="$route.path === '/emergency'"
        class="bg-white"
        :types="'Outside'"
      />
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "SF Pro", "NotoSansThai" Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.rectangle {
  overflow-y: auto;
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
  background-color: #ffffff;
}
.p-tabview-nav {
  background-color: #ffffff;
}
.p-tabview-panels {
  background-color: #ffffff;
}

.p-datatable-wrapper {
  border-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-width: 1px;
  border-radius: 10px;
}
.p-row-odd {
  background-color: #fafafa;
}

.p-dialog {
  border-radius: 40px;
}

.p-tag {
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 15px;
  font-size: 14px;
}

// running
.p-tag-success {
  background-color: #caf1d8;
  color: #188a42;
}

// expired
.p-tag-danger {
  background-color: #ffd0ce;
  color: #b32b24;
}

// upcoming
.p-tag-warning {
  background-color: #ffddc7;
  color: #ae510f;
}

// pending
.p-tag-info {
  background-color: #d0e1fd;
  color: #4270ba;
}

// inactive
.p-tag-secondary {
  background-color: #f1f5f9;
  color: #475569;
}
</style>

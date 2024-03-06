<script setup lang="ts">
import store from "./store";
import { computed, onMounted, onUnmounted, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import PopupUpload from "@/components/PopupUploadCompo.vue";
import setupSocket, { socket } from "./utils/socket";
import { getAllUser, getDevice, getEmergency, getPoster } from "./services";
import { color, createUnique, setFieldPoster } from "./utils/constant";
import { Device } from "./types";

const user = computed(() => store.state.userInfo);
let interval: any = null;

const fetchData = async () => {
  const allUserPromise = getAllUser().then(
    (allUserRes) => (store.state.allUser = allUserRes.user)
  );

  const devicePromise = getDevice().then((deviceRes) => {
    store.state.macNotUse = deviceRes.data
      .filter((e: Device) => !e.deviceName)
      .map((e: Device) => e.MACaddress);

    const devices: Device[] = deviceRes.data.filter(
      (e: Device) => e.deviceName
    );
    devices.map((e, i) => (e.color = color[i]));
    store.state.devices = devices;
    store.state.selectDevice = devices[0].MACaddress || "";
    store.state.filterDevice = devices.map((e) => e.MACaddress);
  });

  const emerPromise = getEmergency().then((emerRes) => {
    store.state.emerPosters = emerRes.emergency;
  });

  const posterPromise = getPoster().then((posterRes) => {
    setFieldPoster(posterRes.poster);
    store.state.posters = posterRes.poster;
    if (store.state.posters) createUnique(store.state.posters);
  });

  await Promise.race([
    allUserPromise,
    devicePromise,
    posterPromise,
    emerPromise,
  ]);
};

onMounted(() => {
  setupSocket();

  interval = setInterval(() => {
    if (user.value.id) {
      fetchData();
    }
  }, 1000 * 5); // fetch every 5 sec
});

watch(user, async () => {
  if (user.value.id) {
    fetchData();
  }
});

onUnmounted(() => {
  socket.disconnect();
  clearInterval(interval);
});
</script>

<template>
  <PopupUpload />
  <div
    class="flex flex-row w-screen h-screen md:fixed"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar class="bg-gradient-to-r from-[#d0fbffbe] to-[#e4fce7c8]" />
    <div class="w-full h-full flex flex-col bg-[#ffffff]">
      <NavBar class="bg-[#f8f8f8]" />
      <router-view class="bg-[#ffffff] w-full" />
    </div>
  </div>
  <div v-else class="flex flex-col w-screen h-full bg-[#ffffff] md:fixed">
    <NavBar
      v-if="$route.path === '/emergency'"
      class="bg-white"
      :types="'Outside'"
    />
    <router-view />
  </div>
  <div
    class="min-h-4 px-4 justify-end inline-flex flex-wrap items-center z-10 right-0 bottom-0 fixed"
    v-if="
      !$route.path.includes('/preview') && !$route.path.includes('/device/')
    "
  >
    <span class="pb-3 text-[9px] font-light text-stone-400 hide-on-mobile">
      <span class="pb-3 font-normal text-stone-600">
        © 2024 Department of Computer Engineering
      </span>
      , Chiang Mai University by 404 Brain not Found Group
      <span class="pb-3 font-normal text-stone-600">
        | All Rights Reserved | Powered by
      </span>
      CPE #30
    </span>
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

@media (max-width: 790px) or (max-height: 600px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>

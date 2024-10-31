<script setup lang="ts">
import store from "./store";
import { computed, onMounted, onUnmounted, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import ModalUpload from "@/components/Modal/ModalUpload.vue";
// import setupSocket, { socket } from "./utils/socket";
import { getAllUser, getDevice, getEmergency, getPoster } from "./services";
import { color, createUnique, setFieldPoster } from "./utils/constant";
import { Device, Emergency } from "./types";
import router from "./router";

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
    store.state.filterDevice = devices.map((e) => e.MACaddress!);
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
  ]).catch(() => {
    localStorage.removeItem("token");
    router.push("/login");
  });
};

onMounted(() => {
  // setupSocket();
  interval = setInterval(() => {
    if (
      !store.state.showUpload &&
      user.value.id &&
      !["/", "/emergency"].includes(router.currentRoute.value.path) &&
      !router.currentRoute.value.path.includes("/preview")
    ) {
      fetchData();
    }
  }, 1000 * 10); // fetch every 10 sec
});

watch(user, async () => {
  if (user.value.id) {
    fetchData();
  }
});

onUnmounted(() => {
  // socket.disconnect();
  clearInterval(interval);
});
</script>

<template>
  <Toast />
  <ModalUpload />
  <div
    class="flex flex-row w-screen h-screen md:fixed bg-[#fefefe] heig"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar />
    <div class="flex flex-col w-full h-full bg-[#fefefe] overflow-hidden">
      <NavBar class="bg-[#fefefe]" />
      <router-view class="bg-[#ffffff] mb-8 mt-1" />
    </div>
  </div>
  <div v-else class="flex flex-col w-screen h-full md:fixed">
    <NavBar
      v-if="['/emergency', '/login'].includes($route.path)"
      class="bg-white"
      :types="'Outside'"
    />
    <router-view />
  </div>
  <div
    class="min-h-2 px-4 justify-end inline-flex flex-wrap items-center z-10 right-0 bottom-0 fixed"
    v-if="
      !$route.path.includes('/preview') && !$route.path.includes('/device/')
    "
  >
    <span
      v-if="$route.path !== '/login'"
      class="pb-2 text-[7px] font-light text-stone-400 hide-on-mobile"
    >
      <span class="pb-3 font-normal text-stone-500">
        © 2024 Department of Computer Engineering
      </span>
      , Chiang Mai University by 404 Brain not Found Group
      <span class="pb-3 font-normal text-stone-500">
        | All Rights Reserved | Powered by
      </span>
      CPE #30
    </span>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Lato", "NotoSansThai" Helvetica, Arial, sans-serif !important;
  -moz-osx-font-smoothing: grayscale !important; /* Firefox */
  -webkit-font-smoothing: subpixel-antialiased !important;
  text-rendering: optimizeLegibility !important;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body * {
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

.rectangle {
  // width: 100%;
  // height: 100%;
  flex: 1 1;
  margin-inline: 0.9rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
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

.p-sortable-column {
  height: 20px;
  padding: 15px;
}

.p-steps-title {
  font-size: 12px !important;
}

.p-tabview-nav-link {
  background-color: #ffffff;
}
.p-tabview-nav {
  background-color: #ffffff;
}
.p-tabview-panels {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.p-datatable-wrapper {
  border-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  border-width: 1px;
  border-radius: 8px;
}
.p-row-odd {
  background-color: #fafafa;
}

.p-dialog {
  border-radius: 40px;
}

.p-dropdown {
  border-radius: 8px;
  box-shadow: none !important;
  border-color: #ced4da;
}
.p-dropdown-panel {
  border-radius: 8px;
}
.p-dropdown-label {
  margin-top: 0.9px !important;
  margin-left: 12px;
  font-size: 12px !important;
}
.p-dropdown-item {
  margin-inline: 8px;
  border-radius: 8px;
  font-size: 12px !important;
}
.p-dropdown-item.p-focus {
  background-color: #14c6a543;
}
.p-dropdown-item.p-highlight {
  background-color: #14c6a588;
}

.heig {
  height: 100svh;
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

.p-inputtext:focus,
.p-inputtext:hover {
  box-shadow: none !important;
  border-color: #c6c6c6 !important;
}

/* Hide the default volume control */
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-volume-slider {
  display: none !important;
}
video::-moz-media-controls-mute-button,
video::-moz-media-controls-volume-slider {
  display: none !important;
}
video::-ms-media-controls-mute-button,
video::-ms-media-controls-volume-slider {
  display: none !important;
}

/* Scroll bar stylings */
::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--lightestgrey);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #bebebe;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #909090;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

@media (max-width: 790px) or (max-height: 600px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>

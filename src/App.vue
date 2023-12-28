<template>
  <div
    class="flex flex-row h-screen font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.email"
  >
    <Sidebar />
    <div class="w-screen flex flex-col">
      <Navbar />
      <router-view />
    </div>
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import store from "./store";
import Navbar from "./components/Navbar.vue";

export default defineComponent({
  components: { Sidebar, Navbar },
  computed: {
    user() {
      return store.state.userInfo;
    },
  },
});
</script>

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

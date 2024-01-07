<template>
  <div
    class="flex flex-row h-screen font-sf-pro"
    v-if="!$route.meta.hideSidebar && user.id"
  >
    <SideBar />
    <div class="w-screen flex flex-col">
      <NavBar />
      <router-view />
    </div>
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideBar from "./components/SideBar.vue";
import store from "./store";
import NavBar from "./components/NavBar.vue";

export default defineComponent({
  components: { SideBar, NavBar },
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

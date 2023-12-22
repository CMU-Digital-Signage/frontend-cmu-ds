<template>
  <div class="flex" v-if="!$route.meta.hideSidebar && user.email">
    <Sidebar />
    <router-view />
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import store from "./store";

export default defineComponent({
  components: { S
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

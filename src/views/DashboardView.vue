<template>
  <div>
    <UserInfo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserInfo from "@/components/UserInfo.vue";
import router from "@/router";
import store from "@/store";

export default defineComponent({
  name: "DashboardView",
  components: { UserInfo },
  beforeRouteEnter(to, from, next) {
    if (!store.state.userInfo?.email) {
      next({ path: "/login" });
    } else {
      next();
    }
  },
});
</script>

<style></style>

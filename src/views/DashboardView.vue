<template>
  <div>
    <UserInfo />
    <button @click="$router.push('/login')">Log out</button>
  </div>
</template>

<script lang="ts">
import UserInfo from "@/components/UserInfo.vue";
import router from "@/router";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DashboardView",
  components: { UserInfo },
});
</script>

<style></style>

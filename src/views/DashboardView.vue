<template>
  <div class="Dashboard">
    <HelloWorld msg="Test 1 2 3" />
    <button @click="$router.push('/login')">Log out</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "DashboardView",
  components: {
    HelloWorld,
  },
});
</script>

<style></style>

<template>
  <div class="py-32 justify-center flex flex-row gap-10">
    <button @click="$router.push('/login')">Back</button>
    <button @click="$router.push('/')">Dashboard</button>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  name: "cmuOAuthCallbackView",
  components: {},
});
</script>

<style></style>

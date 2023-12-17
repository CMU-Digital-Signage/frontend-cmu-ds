<template>
  <div class="w-auto h-96 my-40 mx-24 p-10 justify-center bg-babyBule">
    <button
      class="w-96 h-12 relative rounded-[40px] bg-periwinkle font-sf-pro-rounded text-white text-2xl"
      @click="$router.push('/')"
    >
      Login with CMU Account
      <!-- <img class="w-7" alt="cmulogo" src="../assets/images/cmu-logo-th.png" /> -->
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginView",
  components: {},
});
</script>

<style></style>

<template>
  <div
    class="w-auto h-96 my-40 mx-60 p-10 justify-center bg-babyBule rounded-md flex flex-col items-center text-center"
  >
    <span class="text-4xl mb-6 font-bold font-sf-pro">CPE Digital Signage</span>
    <span class="text-xl mb-2 font-notoThai">ลงชื่อเข้าสู่ระบบ</span>
    <button
      class="flex items-center justify-center w-96 h-12 relative rounded-[40px] bg-periwinkle font-sf-pro text-white text-2xl"
      @click="$router.push('/')"
    >
      <img
        class="w-7 mr-2"
        alt="cmulogo"
        src="../assets/images/cmu-logo-th.png"
      />
      <span class="text-xl">Login with CMU Account</span>
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

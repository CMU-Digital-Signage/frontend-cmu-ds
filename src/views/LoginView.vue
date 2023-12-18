<template>
  <div class=" bg-[#f0f0f0] h-screen flex items-center justify-center">
    <!-- Set height to full screen and center content -->
    <div
      class="w-auto h-auto p-24 bg-[#fcfcfc] border-1 border-[#839CBC] drop-shadow-xl rounded-[15px] flex flex-col items-center text-center"
    >
      <img class="w-120 h-20 mb-12" alt="cpelogo" src="../assets/images/cpe-logo.png" />

      <span class="text-4xl mb-6 font-medium text-[#4A484C] font-sf-pro-rounded">Digital Signage</span>
      <span class="text-lg mb-3 font-notoThai">ลงชื่อเข้าสู่ระบบ</span>
      <button
        class="flex items-center justify-center w-auto p-5 h-12 relative rounded-[10px] bg-periwinkle font-sf-pro text-white text-2xl"
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

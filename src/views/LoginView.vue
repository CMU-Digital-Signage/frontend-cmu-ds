<template>
  <div
    class="bg-gradient-to-r from-[#E5F9FA] to-[#F6FDF7] h-screen flex items-center justify-center"
  >
    <div
      class="relative w-2/3 h-3/4 bg-gradient-to-r from-[#F8FEFE] to-[#F9FDFC] border-2 border-[#B8F1F0] drop-shadow-xl rounded-[15px] flex flex-col items-center text-center"
    >
      <img
        class="absolute top-0 left-0 w-36 h-11 mt-8 ml-20"
        alt="cpelogo"
        src="../assets/images/cpe-logo.png"
      />
      <div
        class="absolute top-40 left-0 w-auto px-14 h-1/2 ml-20 rounded-[15px] flex flex-col items-center justify-center text-center"
      >
        <span
          class="text-4xl mb-6 font-medium text-[#000000] font-sf-pro-rounded"
          >CPE Digital Signage</span
        >
        <span class="text-lg mb-3 font-notoThai">ลงชื่อเข้าสู่ระบบ</span>
        <button
          class="flex items-center justify-center w-auto p-5 h-11 relative rounded-[10px] bg-[#696CA3] text-white text-2xl button-container"
          @click="redirectToOAuth()"
        >
          <img
            class="w-7 mr-2"
            alt="cmulogo"
            src="../assets/images/cmu-logo-th.png"
          />
          <span class="text-lg">Login with CMU Account</span>
        </button>
      </div>
      <img
        class="absolute top-28 right-0 w-1/2"
        alt="picLogin"
        src="../assets/images/picLogin.png"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import { getUserInfo } from "@/services";

export default defineComponent({
  methods: {
    redirectToOAuth() {
      window.location = process.env.VUE_APP_NEXT_PUBLIC_CMU_OAUTH_URL;
    },
  },
  async beforeRouteEnter(to, from, next) {
    if (!store.state.userInfo.id && localStorage.getItem("token")) {
      const res = await getUserInfo();
      if (res.ok) {
        store.state.userInfo = res.user;
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      next();
    }
  },
});
</script>

<style>
.button-container:hover {
  background-color: #545787;
}
</style>

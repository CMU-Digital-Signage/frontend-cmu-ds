<template>
  <div
    class="bg-gradient-to-r from-[#E5F9FA] to-[#F6FDF7] h-screen flex items-center justify-center"
  >
    <div
      class="w-full rounded-none md:w-2/3 relative h-3/4 bg-gradient-to-r from-[#F8FEFE] to-[#f3fcfa] border-2 border-[#B8F1F0] drop-shadow-xl md:rounded-[15px] flex flex-col items-center text-center"
    >
      <img
        class="absolute w-24 h-7 mt-4 ml-4 top-0 left-0 md:w-36 md:h-11 md:mt-8 md:ml-20"
        alt="cpelogo"
        src="../assets/images/cpe-logo.png"
      />

      <div
        class="absolute top-32 h-fit md:top-40 md:left-0 w-auto md:px-14 md:h-1/2 md:ml-20 rounded-[15px] flex flex-col md:items-center md:justify-center md:text-center "
      >
        <span
          class="mt-36 text-2xl md:mt-12 md:text-4xl md:mb-8 mb-3 font-medium text-[#000000] font-sf-pro-rounded"
          >CPE Digital Signage</span
        >
        <span class="md:text-lg text-sm mb-1 mt-2 font-notoThai"
          >ลงชื่อเข้าสู่ระบบ</span
        >
        <button
          class="flex items-center md:mb-4 mb-3 justify-center w-auto md:p-5 md:h-11 h-fit p-2 relative rounded-[10px] bg-[#696CA3] text-white text-2xl button-container"
          @click="redirectToOAuth()"
        >
          <img
            class="md:w-7 mr-2 w-5 ml-2"
            alt="cmulogo"
            src="../assets/images/cmu-logo-th.png"
          />
          <span class=" md:text-lg text-sm font-semibold">Login with CMU Account</span>
        </button>
        <router-link to="/emergency">
          <Button
            class="  w-auto md:p-5 md:h-11 h-fit p-2 relative rounded-[10px] text-sm md:text-lg button-containerEmer"
            outlined
            severity="danger"
          >
            <i class="pi pi-exclamation-triangle"></i>
            <p class="ml-2 font-semibold">Emergency Activation</p>
          </Button>
        </router-link>
      </div>
      <img
        class="absolute md:top-36 md:right-0 md:w-1/2 top-10 w-72"
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
      window.location.href = process.env.VUE_APP_NEXT_PUBLIC_CMU_OAUTH_URL!;
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

<style scoped>
.button-container:hover {
  background-color: #545787;
}

.button-containerEmer:hover {
  background-color: #d65f5f;
  color: white;
}
</style>

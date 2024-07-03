<template>
  <div
    class="bg-gradient-to-b from-[#cfeefa] to-[#aff4bad9] h-screen flex items-center justify-center overflow-hidden sm:overscroll-y-none"
  >
    <div
      class="w-full rounded-none md:w-4/5 h-full relative md:h-3/4  bg-[rgba(255,255,255,0.55)] drop-shadow-xl md:rounded-[15px] flex flex-col items-center text-center"
    >
      <img
        class="absolute md:mt-6 md:ml-6 w-24 h-7 mt-4 ml-4 top-0 left-0 md:w-36 md:h-11 lg:mt-8 lg:ml-20"
        alt="cpelogo"
        src="../assets/images/cpe-logo.png"
      />

      <div
        class="absolute top-48 h-fit lg:top-40 sm:left-0 w-auto lg:px-14 md:px-10 md:h-1/2 md:ml-32 rounded-[15px] flex flex-col md:items-center md:justify-center md:text-center"
      >
        <span
          class="font-sf-pro-rounded mt-48 text-2xl lg:mt-12 md:text-xl lg:text-3xl lg:mb-8 cursor-default mb-7 font-medium text-[#2a2a2a]"
        >
          pixelParade
        </span>
        <span class="md:text-lg text-sm cursor-default mb-1 mt-2 font-notoThai hide-on-mobile">
          ลงชื่อเข้าสู่ระบบ
        </span>
        <span class="show-on-mobile text-[#484848]">
          To login, go to pixelParade <br />on your tablet or desktop
        </span>
        <button
          class="flex items-center hide-on-mobile md:mb-4 mb-3 justify-center w-auto md:px-4 md:h-11 h-fit relative rounded-[10px] bg-white text-[#696AA9] text-lg button-container"
          @click="redirectToOAuth()"
          style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;"
        >
          <img
            class="md:w-7 mr-2 w-5"
            alt="cmulogo"
            src="../assets/images/cmu-logo-th.png"
          />
          <span class="font-sf-pro-rounded md:text-[14px] text-sm font-medium">
            Login with CMU Account
          </span>
        </button>
        <router-link to="/emergency">
          <Button
            class="w-auto  md:h-10 h-fit md:px-3 bg-[#ff6961] relative rounded-[10px] text-sm md:text-lg border-0 button-containerEmer"
            style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;"
          >
            <i class="pi pi-exclamation-triangle"></i>
            <p class="font-sf-pro-rounded ml-2 font-medium text-[14px]">
              Emergency Activation
            </p>
          </Button>
        </router-link>
      </div>
      <img
        class="absolute lg:top-16 top-24 lg:right-0 w-64 md:w-72 lg:w-1/2"
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
      window.location.href =
        process.env.VUE_APP_NEXT_PUBLIC_CMU_OAUTH_URL || "";
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
  background-color: #ebebeb;
}

.button-containerEmer:hover {
  background-color: #ed5c55;
  color: white;
}

.show-on-mobile {
  display: none;
}

@media (max-width: 790px) or (max-height: 600px) {
  .hide-on-mobile {
    display: none;
  }
  .show-on-mobile {
    display: flex;
    margin-bottom: 12px;
    align-items: center;
    justify-content: center;
  }
}
</style>

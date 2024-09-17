<template>
  <div
    class="bgImages h-screen w-screen pb-5 flex flex-col items-center justify-center overflow-hidden sm:overscroll-y-none"
  >
    <!-- <img
        class="absolute md:mt-6 md:ml-6 w-24 h-7 mt-4 ml-4 top-0 left-0 md:w-36 md:h-11 lg:mt-8 lg:ml-20"
        alt="cpelogo"
        src="../assets/images/cpe-logo.png"
        
      /> -->

    <span
      class="px-5 md:!text-6xl md:mt-16 text-4xl lg:mb-8 cursor-default mb-7 font-semibold text-[#000000]"
    >
      Dynamic content
      <span class="!font-normal"
        >starts with
        <span
          class="bg-gradient-to-r from-blue-500 via-green-500 to-indigo-400 text-transparent bg-clip-text"
          >pixelParade</span
        ></span
      >
      <p class="text-xl text-[#000000] font-medium mt-3 hide-on-mobile">
        Every pixel counts. Tell your story, one tiny block at a time.
      </p>
    </span>

    <Button
      class="flex items-center hide-on-mobile bg-[#5768D5] hover:bg-[#4251b1] border-none md:mb-4 py-5 justify-center w-auto md:px-5 !h-8 relative rounded-[8px] text-white text-lg button-container"
      @click="redirectToOAuth()"
      style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
    >
      <img
        class="md:w-7 mr-2 w-5"
        alt="cmulogo"
        src="../assets/images/cmu-logo-th-white.png"
      />
      <span class="md:text-[14px] text-sm font-semibold">
        Sign in CMU Account
      </span>
    </Button>

    <div
      class="lg:absolute h-fit lg:top-40 sm:left-0 w-auto lg:px-14 lg:ml-32 md:w-fit rounded-[15px] flex flex-row items-center justify-center md:text-center"
    >
      <div class="show-on-mobile flex flex-col gap-7">
        <span class="text-[#000000]">
          pixelParade unavailable in your screen device <br />
          To login, go to pixelParade <br />on your tablet or desktop
        </span>

        <router-link to="/emergency">
          <button
            class="w-auto h-9 px-3 border-[1px] border-none bg-[#ff6961] text-white relative rounded-[8px] text-sm md:text-lg button-containerEmer flex flex-row items-center justify-center"
          >
            <i class="pi pi-exclamation-triangle"></i>
            <p class="ml-2 font-semibold text-[14px]">Emergency</p>
          </button>
        </router-link>
      </div>
    </div>
    <!-- card -->
    <div
      class="hide-on-mobile ipad-landscape:overflow-x-auto ipad-landscape:grid ipad-landscape:grid-cols-5 ipad-portrait:overflow-y-auto ipad-portrait:overflow-x-auto ipad-portrait:flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 overflow-x-auto w-full h-full px-14 py-3 mt-5 gap-5"
    >
      <div
        class="relative shadow bg-[#ffffff] min-w-48 ipad-portrait:min-w-60 ipad-landscape:min-w-40 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden hover:shadow-lg hover:shadow-[#9B9B9B] transform transition ease-in-out duration-200 hover:-translate-y-2"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">UPLOAD & DISPLAY</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Digital Signage
          </span>
        </div>

        <img
          class="h-full rounded-xl rounded-r-none object-left scale-90 translate-x-3 object-cover mt-5"
          alt="cmulogo"
          src="../assets/images/upload.png"
        />
      </div>

      <div
        class="relative shadow bg-[#ffffff] min-w-48 ipad-portrait:min-w-60 ipad-landscape:min-w-40 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden hover:shadow-lg hover:shadow-[#9B9B9B] transform transition ease-in-out duration-200 hover:-translate-y-2"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">SCHEDULING</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Intuitive Calendar
          </span>
        </div>

        <img
          class="h-full rounded-xl rounded-r-none object-left scale-90 translate-x-3 object-cover mt-5 shadow-md"
          alt="cmulogo"
          src="../assets/images/calendar.png"
        />
      </div>

      <div
        class="relative shadow bg-[#ffffff] min-w-48 ipad-portrait:min-w-60 ipad-landscape:min-w-40 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden hover:shadow-lg hover:shadow-[#9B9B9B] transform transition ease-in-out duration-200 hover:-translate-y-2"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">SHARE INFOMATION</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Glance Bar
          </span>
        </div>

        <img
          class="h-full rounded-xl rounded-r-none object-left scale-125 translate-x-12 object-cover mt-[88px] shadow-lg"
          alt="cmulogo"
          src="../assets/images/glance.png"
        />
      </div>

      <div
        class="relative shadow bg-[#ffffff] min-w-48 ipad-portrait:min-w-60 ipad-landscape:min-w-40 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden hover:shadow-lg hover:shadow-[#9B9B9B] transform transition ease-in-out duration-200 hover:-translate-y-2"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">ACT SWIFTLY</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Emergency
          </span>
        </div>

        <img
          class="h-full object-cover object-left rounded-xl rounded-r-none scale-90 translate-x-3 mt-5 shadow-md"
          alt="cmulogo"
          src="../assets/images/emegency2.png"
        />
      </div>
      <div
        class="relative shadow bg-[#ffffff] min-w-48 ipad-portrait:min-w-60 ipad-landscape:min-w-40 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden hover:shadow-lg hover:shadow-[#9B9B9B] transform transition ease-in-out duration-200 hover:-translate-y-2"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">EASE TO MANAGE</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            User & Device
          </span>
        </div>

        <img
          class="h-full object-left scale-90 rounded-xl translate-x-3 object-cover mt-5 shadow-md"
          alt="cmulogo"
          src="../assets/images/user.png"
        />
      </div>
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
.bgImages {
  background-size: cover;
  background-position: center;
  background-color: #f9f9f9;
}

.show-on-mobile {
  display: none;
}
.shadow {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
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

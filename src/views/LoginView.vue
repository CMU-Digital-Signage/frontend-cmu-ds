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
      class="px-5 md:!text-6xl md:mt-16 text-4xl lg:mb-8 cursor-default mb-7 font-bold text-[#2a2a2a]"
    >
      Dynamic content
      <span class="!font-medium">starts with pixelParade</span>
      <p class="text-xl font-normal mt-3 hide-on-mobile">
        Every pixel counts. Tell your story, one tiny block at a time.
      </p>
    </span>

    <Button
      class="flex items-center hide-on-mobile bg-[#6869AE]  border-none md:mb-4 py-5 justify-center w-auto md:px-4 md:h-11 h-fit relative rounded-[10px] text-white text-lg button-container"
      @click="redirectToOAuth()"
      style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
    >
      <img
        class="md:w-7 mr-2 w-5"
        alt="cmulogo"
        src="../assets/images/cmu-logo-th-white.png"
      />
      <span class="md:text-[14px] text-sm font-semibold">
        Login with CMU Account
      </span>
    </Button>

    <div
      class="lg:absolute h-fit lg:top-40 sm:left-0 w-auto lg:px-14 lg:ml-32 md:w-fit rounded-[15px] flex flex-row items-center justify-center md:text-center"
    >
      <!-- <span
            class="md:text-lg text-sm cursor-default mb-1 mt-2 font-notoThai hide-on-mobile"
          >
            ลงชื่อเข้าสู่ระบบ
          </span> -->
      <span class="show-on-mobile text-[#000000]">
        To login, go to pixelParade <br />on your tablet or desktop
      </span>
    </div>
    <!-- <img
          class="lg:absolute lg:top-16 lg:right-0 w-64 md:w-72 lg:w-1/2"
          alt="picLogin"
          src="../assets/images/picLogin.png"
        /> -->

    <!-- card -->
    <div
      class="hide-on-mobile grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 overflow-x-auto  w-full h-full px-14 mt-5 gap-5"
    >
      <div
        class="relative  bg-[#f4f4f4] min-w-64 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden "
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">UPLOAD & DISPLAY</span>
          <span class="flex  flex-col text-xl font-semibold break-words w-full">
            Digital Signage
          </span>
        </div>

        <img
          class="  h-full rounded-xl object-left scale-90 translate-x-3  object-cover mt-5" 
          alt="cmulogo"
          src="../assets/images/upload.png"
        />
      </div>
      <div
        class="relative  bg-[#f4f4f4] min-w-64 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">SCHEDULING</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Intuitive Calendar
          </span>
        </div>

        <img
        class="  h-full rounded-xl object-left scale-90 translate-x-3  object-cover mt-5" 
          alt="cmulogo"
          src="../assets/images/calendar.png"
        />
      </div>
      <div
        class="relative bg-[#f4f4f4] min-w-64 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">SHARE INFOMATION</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Glance Bar
          </span>
        </div>

        <img
        class=" absolute rounded-xl  h-full object-left scale-150 translate-x-8 right-0 object-cover mt-[180px]" 
          alt="cmulogo"
          src="../assets/images/glance.png"
        />
      </div>
      <div
        class="relative bg-[#f4f4f4] min-w-64 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">ACT SWIFTLY</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            Emergency
          </span>
        </div>

        <img
        class="  h-full object-left rounded-xl scale-90 translate-x-3  object-cover mt-3" 
          alt="cmulogo"
          src="../assets/images/emergency.png"
        />
      </div>
      <div
        class="relative bg-[#f4f4f4] min-w-64 max-w-full h-full rounded-2xl pl-4 pt-5 flex-col overflow-hidden"
      >
        <div class="flex flex-col text-start gap-1">
          <span class="text-sm font-normal">EASE TO MANGAE</span>
          <span class="flex flex-col text-xl font-semibold break-words w-full">
            User & Device
          </span>
        </div>

        <img
        class="  h-full object-left scale-90 rounded-xl translate-x-3  object-cover mt-3" 
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
.button-container:hover {
  background-color: #52538a;
}

.bgImages {
  background-image: url("../assets/images/bg-test-1.png");
  background-size: cover;
  background-position: center;
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

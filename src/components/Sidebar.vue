<template>
  <font-awesome-icon icon="fa-brands fa-twitter" />
  <div
    class="flex flex-col justify-between h-screen shadow side-bar"
    :class="openSidebar == true ? 'side-bar-open' : 'side-bar-close'"
    style="background-color: #f6f6f6; border-right: 1px solid #c7bbbb"
  >
    <div class="space-y-5 font-sf-pro" :class="{ 'p-4': openSidebar }">
      <div
        class="flex justify-between items-start"
        :class="{ 'p-4': !openSidebar }"
      >
        <div class="flex items-center gap-2">
          <img
            class="w-6 items-center"
            alt="cmulogo"
            src="../assets/images/cpe-mini-logo.png"
          />
          <p
            :class="{ 'font-bold text-[20px]': openSidebar }"
            v-show="openSidebar"
            class="fixed left-12"
          >
            CPE Signage
          </p>
        </div>
        <button
          @click="toggleSidebar()"
          :class="{
            'scale-x-[-1]': !openSidebar,
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g clip-path="url(#clip0_181_143)">
              <path
                d="M3.33325 5H17.8787M6.06052 12.2727H17.8787M8.7878 19.5455H17.8787"
                stroke="#5B5B5B"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_181_143">
                <rect width="40" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div
        class="mb-1"
        :class="
          openSidebar == true ? '-ml-1 pt-5' : 'pt-10 flex justify-center '
        "
      >
        <p
          class="flex ml-3 pb-2 font-semibold text-[18px] color-[#282828]"
          v-show="openSidebar"
        >
          Menu
        </p>
        <ul
          class="flex flex-col py-1 space-y-2 text-[15px] text-left"
          :class="openSidebar ? 'ml-3' : 'justify-center'"
        >
          <router-link to="/">
            <Button
              class="bg-[#f6f6f6] space-x-2 text-black font-sf-pro text-[16px] flex gap-1 side-bar"
              v-if="openSidebar"
              link
            >
              <i class="pi pi-microsoft"></i>
              <span class="menu-ho" :class="{ underline: $route.path === '/' }"
                >Dashboard</span
              >
            </Button>
            <Button
              class="text-black rounded-full h-10 w-10 flex items-center justify-center"
              :class="{ 'bg-[#cfcfcf]': $route.path === '/' }"
              v-else
              link
            >
              <i class="pi pi-microsoft"></i>
            </Button>
          </router-link>

          <router-link to="/file">
            <div>
              <Button
                class="bg-[#f6f6f6] space-x-2 text-black font-sf-pro text-[16px] fixed flex gap-1"
                v-if="openSidebar"
                link
              >
                <i class="pi pi-file"></i>
                <span
                  class="menu-ho"
                  :class="{ underline: $route.path === '/file' }"
                  >File Manager</span
                >
              </Button>
              <Button
                class="text-black rounded-full h-10 w-10 flex items-center justify-center"
                :class="{ 'bg-[#cfcfcf]': $route.path === '/file' }"
                v-else
                icon="pi pi-file"
                link
              >
              </Button>
            </div>
          </router-link>
          <router-link to="/deviceManage" :class="{ 'pt-10': openSidebar }">
            <Button
              class="bg-[#f6f6f6] space-x-2 text-black font-sf-pro text-[16px] mb-1 flex gap-1"
              v-if="openSidebar"
              link
            >
              <i class="pi pi-desktop"></i>
              <span
                class="menu-ho"
                :class="{ underline: $route.path === '/deviceManage' }"
                >Device</span
              >
            </Button>
            <Button
              class="text-black rounded-full h-10 w-10 flex items-center justify-center"
              :class="{ 'bg-[#cfcfcf]': $route.path === '/deviceManage' }"
              v-else
              icon="pi pi-desktop"
              link
            >
            </Button>
          </router-link>
        </ul>
      </div>

      <div v-if="!openSidebar" class="pt-4">
        <p class="border-t border-[#AAA] mx-3"></p>
      </div>

      <!-- admin management sidebar -->
      <div
        v-if="user?.isAdmin"
        :class="
          openSidebar == true ? '-ml-1 pt-1' : 'pt-1 flex justify-center '
        "
      >
        <p
          class="flex ml-3 pb-2 font-semibold text-[16px] color-[#282828]"
          v-show="openSidebar"
        >
          Admin
        </p>
        <ul
          class="py-1 space-y-2 text-[15px] text-left"
          :class="openSidebar ? 'ml-4' : 'flex flex-col justify-center -pt-3'"
        >
          <router-link to="/admin">
            <Button
              class="bg-[#f6f6f6] space-x-2 text-black font-sf-pro text-[16px] flex gap-1 outline-none"
              v-if="openSidebar"
              link
            >
              <i class="pi pi-users"></i>
              <span
                class="menu-ho"
                :class="{ underline: $route.path === '/admin' }"
                >Management</span
              >
            </Button>
            <Button
            class=" text-black rounded-full  h-10 w-10 flex items-center justify-center "
              :class="{'bg-[#cfcfcf]': $route.path === '/admin' }"
              v-else
              icon="pi pi-users"
              link
            >
            </Button>
          </router-link>
          <router-link to="/emergency">
            <Button
              class="bg-[#f6f6f6] space-x-2 text-[#f00] font-sf-pro text-[16px] flex gap-1 underline-label"
              v-if="openSidebar"
              link
            >
              <i class="pi pi-exclamation-triangle"></i>
              <span
                class="menu-ho"
                :class="{ underline: $route.path === '/emergency' }"
                >Emergency</span
              >
            </Button>
            <Button
            class=" text-[#f00]  rounded-full  h-10 w-10 flex items-center justify-center -mt-2 "
              :class="{'bg-[#cfcfcf] text-black': $route.path === '/emergency' }"
              v-else
              icon="pi pi-exclamation-triangle"
              link
            >
            </Button>
          </router-link>
        </ul>
      </div>
    </div>

    <!-- <UserInfo /> -->
    <div
      class="flex h-14 w-full px-4 items-center justify-between"
      style="border-top: 1px solid #aaa"
    >
      <div class="flex flex-row gap-2 items-center" v-show="openSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          viewBox="0 0 39 39"
          fill="none"
        >
          <path
            d="M10.0685 28.4131C11.4498 27.4186 12.9155 26.6327 14.4658 26.0553C16.0149 25.4768 17.693 25.1875 19.5 25.1875C21.3059 25.1875 22.984 25.4768 24.5342 26.0553C26.0834 26.6327 27.5492 27.4181 28.9315 28.4115C30.004 27.3022 30.8669 25.9913 31.5201 24.479C32.1734 22.9645 32.5 21.3048 32.5 19.5C32.5 15.8979 31.2341 12.8305 28.7024 10.2976C26.1706 7.76479 23.1032 6.49892 19.5 6.5C15.8979 6.5 12.8305 7.76642 10.2976 10.2992C7.76479 12.8321 6.49892 15.899 6.5 19.5C6.5 21.3059 6.82663 22.965 7.47988 24.4774C8.13313 25.9908 8.996 27.3027 10.0685 28.4131ZM19.5016 20.3125C18.1323 20.3125 16.9769 19.8423 16.0355 18.902C15.0952 17.9627 14.625 16.8085 14.625 15.4391C14.625 14.0698 15.0952 12.9144 16.0355 11.973C16.9748 11.0327 18.129 10.5625 19.4984 10.5625C20.8677 10.5625 22.0231 11.0327 22.9645 11.973C23.9048 12.9123 24.375 14.0665 24.375 15.4359C24.375 16.8052 23.9048 17.9606 22.9645 18.902C22.0252 19.8423 20.871 20.3125 19.5016 20.3125ZM19.5 34.125C17.4601 34.125 15.5507 33.7453 13.7719 32.9859C11.993 32.2275 10.445 31.1897 9.12763 29.8724C7.81138 28.555 6.77354 27.007 6.01412 25.2281C5.25471 23.4493 4.875 21.5399 4.875 19.5C4.875 17.4601 5.25471 15.5507 6.01412 13.7719C6.77246 11.993 7.81029 10.445 9.12763 9.12763C10.445 7.81138 11.993 6.77354 13.7719 6.01412C15.5507 5.25471 17.4601 4.875 19.5 4.875C21.5399 4.875 23.4493 5.25471 25.2281 6.01412C27.007 6.77246 28.555 7.81029 29.8724 9.12763C31.1886 10.445 32.2265 11.993 32.9859 13.7719C33.7453 15.5507 34.125 17.4601 34.125 19.5C34.125 21.5399 33.7453 23.4493 32.9859 25.2281C32.2275 27.007 31.1897 28.555 29.8724 29.8724C28.555 31.1886 27.007 32.2265 25.2281 32.9859C23.4493 33.7453 21.5399 34.125 19.5 34.125ZM19.5 32.5C20.9982 32.5 22.4721 32.2378 23.9216 31.7135C25.3722 31.1903 26.6256 30.4731 27.6819 29.562C26.6256 28.7148 25.4036 28.0448 24.0159 27.5519C22.6292 27.059 21.1239 26.8125 19.5 26.8125C17.8772 26.8125 16.367 27.0535 14.9695 27.5356C13.572 28.0177 12.3549 28.6932 11.3181 29.562C12.3744 30.472 13.6278 31.1892 15.0784 31.7135C16.5279 32.2378 18.0018 32.5 19.5 32.5ZM19.5 18.6875C20.4122 18.6875 21.1819 18.3739 21.8091 17.7466C22.4364 17.1194 22.75 16.3497 22.75 15.4375C22.75 14.5253 22.4364 13.7556 21.8091 13.1284C21.1819 12.5011 20.4122 12.1875 19.5 12.1875C18.5878 12.1875 17.8181 12.5011 17.1909 13.1284C16.5636 13.7556 16.25 14.5253 16.25 15.4375C16.25 16.3497 16.5636 17.1194 17.1909 17.7466C17.8181 18.3739 18.5878 18.6875 19.5 18.6875Z"
            fill="black"
          />
        </svg>
        <div class="flex flex-col items-start text-[14px] fixed left-14">
          <p v-if="user">
            {{ user.firstName }} {{ (user?.lastName || "").charAt(0) }}.
          </p>
          <div class="-mt-1 text-[#0094ff] text-[13px] font-700">
            <p v-if="user?.isAdmin">Admin</p>
            <p v-if="!user?.isAdmin">Instructor</p>
          </div>
        </div>
      </div>
      <button @click="signOut()" :class="openSidebar ? 'px-0.5' : 'p-2'">
        <div class="flex justify-center items-center logout-bt 'translate-x-0'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="20"
            viewBox="0 0 20 22"
            fill="none"
          >
            <path
              d="M13.0801 3.86007V2.84007C13.0801 2.27674 12.6235 1.82007 12.0601 1.82007H2.88011C2.31677 1.82007 1.86011 2.27674 1.86011 2.84007V19.1601C1.86011 19.7234 2.31678 20.1801 2.88011 20.1801H12.0601C12.6235 20.1801 13.0801 19.7234 13.0801 19.1601V18.1401"
              stroke="#282828"
              class="logout-icon"
              stroke-width="1.74857"
              stroke-linecap="round"
            />
            <path
              d="M6.96021 11H12.5702H18.1802"
              stroke="#282828"
              class="logout-icon"
              stroke-width="1.74857"
              stroke-linecap="round"
            />
            <path
              d="M14.6104 7.43005L18.1804 11.0001L14.6104 14.5701"
              stroke="#282828"
              class="logout-icon"
              stroke-width="1.74857"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import store from "@/store";
import router from "@/router";
import { signOut } from "@/services";

export default defineComponent({
  name: "SideBar",
  computed: {
    user() {
      return store.state.userInfo;
    },
  },
  methods: {
    signOut() {
      signOut();
    },
    toggleSidebar() {
      this.openSidebar = !this.openSidebar;
    },
  },
  data() {
    return {
      openSidebar: true,
    };
  },
});
</script>

<style>
Button {
  box-shadow: none;
}

.menu-ho:hover {
  text-decoration: underline;
}
.logout-bt {
  width: 36px;
  height: 36px;
  border-radius: 11.52px;
  background: #e5e4e4;
  transition: 0.1s;
}
.logout-bt:hover {
  background: #ff5252;
}
.logout-bt:hover .logout-icon {
  stroke: #fff;
}
.underline-ho-em:hover {
  border-bottom: 1px solid #f00;
}
.side-bar {
  overflow: hidden;
  transition: all 300ms ease-in-out;
}

.side-bar-open {
  width: 18rem;
}
.side-bar-close {
  width: 90px;
}
</style>

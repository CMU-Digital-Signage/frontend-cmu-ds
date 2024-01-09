<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SideBar",
});
</script>
<script setup lang="ts">
import { computed } from "vue";
import store from "@/store";
import { signOut } from "@/services";

const user = computed(() => store.state.userInfo);
const device = computed(() => store.state.devices);
const openSidebar = computed(() => store.state.openSidebar);

const toggleSidebar = () => {
  store.commit("setOpenSidebar", !openSidebar.value);
};
</script>

<template>
  <font-awesome-icon icon="fa-brands fa-twitter" />
  <div
    class="flex flex-col justify-between h-screen shadow side-bar sticky"
    :class="openSidebar == true ? 'side-bar-open pl-[4px]' : 'side-bar-close'"
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
        <Button
          @click="toggleSidebar()"
          link
          class="text-black bg-[#f6f6f600] rounded-full h-6 w-6 flex items-center justify-center menu-ho outline-none"
          :style="{
            transform: openSidebar ? '' : 'translateX(8px)',
            marginLeft: openSidebar ? '' : '-8px',
          }"
          v-if="$route.path !== '/searchfile' && $route.path !== '/uploadfile'"
        >
          <i
            :class="{
              'pi pi-align-left': !openSidebar,
              'pi pi-align-right': openSidebar,
            }"
          ></i>
        </Button>

        <Button
          @click="$router.push('/')"
          class="text-black bg-[#f6f6f6] rounded-full h-6 w-6 flex items-center justify-center menu-ho outline-none"
          v-if="$route.path === '/searchfile' || $route.path === '/uploadfile'"
          :style="{
            transform: openSidebar ? '' : 'translateX(8px)',
            marginLeft: openSidebar ? '' : '-8px',
          }"
          link
        >
          <i class="pi pi-times"></i>
        </Button>
      </div>

      <div
        v-if="$route.path !== '/searchfile'"
        :class="{
          'pt-3': openSidebar,
          'pt-5 flex justify-center': !openSidebar,
        }"
      >
        <p
          class="flex pb-1 font-semibold text-[14px] text-[#615F5F]"
          v-show="openSidebar"
        >
          Menu
        </p>
        <ul
          class="flex flex-col py-1 space-y-2 text-[15px] text-left"
          :class="openSidebar ? '' : 'justify-center'"
        >
          <router-link to="/">
            <Button
              class="bg-[#f6f6f6] menu-ho w-full space-x-2 text-[#282828] font-sf-pro font-semibold text-[14px] flex gap-1 side-bar rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/' ? '#70aaeb2c' : '',
                color: $route.path === '/' ? '#1b7be8' : '',
              }"
            >
              <i class="pi pi-microsoft"></i>
              <span>Dashboard</span>
            </Button>
            <Button
              class="text-black rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{ 'bg-[#70aaeb2c]': $route.path === '/' }"
              v-else
              link
            >
              <i class="pi pi-microsoft"></i>
            </Button>
          </router-link>

          <router-link to="/file">
            <div>
              <Button
                class="bg-[#f6f6f6] w-full space-x-2 text-[#282828] font-sf-pro font-semibold text-[14px] flex gap-1 menu-ho rounded-lg"
                v-if="openSidebar"
                link
                :style="{
                  'background-color':
                    $route.path === '/file' ? '#70aaeb2c' : '',
                  color: $route.path === '/file' ? '#1b7be8' : '',
                }"
              >
                <i class="pi pi-file"></i>
                <span>File</span>
              </Button>
              <Button
                class="text-black rounded-full h-10 w-10 flex items-center justify-center menu-ho"
                :class="{ 'bg-[#70aaeb2c]': $route.path === '/file' }"
                v-else
                icon="pi pi-file"
                link
              >
              </Button>
            </div>
          </router-link>
          <router-link to="/deviceManage">
            <Button
              class="bg-[#f6f6f6] w-full space-x-2 text-[#282828] font-sf-pro font-semibold text-[14px] flex gap-1 menu-ho rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/deviceManage' ? '#70aaeb2c' : '',
                color: $route.path === '/deviceManage' ? '#1b7be8' : '',
              }"
            >
              <i class="pi pi-desktop"></i>
              <span>Device</span>
            </Button>
            <Button
              class="text-black rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{ 'bg-[#70aaeb2c]': $route.path === '/deviceManage' }"
              v-else
              icon="pi pi-desktop"
              link
            >
            </Button>
          </router-link>
        </ul>
      </div>

      <!-- admin management sidebar -->
      <div
        v-if="user?.isAdmin && $route.path !== '/searchfile'"
        :class="openSidebar == true ? '' : ' flex justify-center '"
      >
        <p
          class="flex pb-1 font-semibold text-[14px] text-[#615F5F]"
          v-show="openSidebar"
        >
          Admin
        </p>
        <ul
          class="flex flex-col py-1 space-y-2 text-[15px] text-left"
          :class="openSidebar ? '' : 'flex flex-col justify-center -pt-3'"
        >
          <router-link to="/admin">
            <Button
              class="bg-[#f6f6f6] space-x-2 w-full text-[#282828] font-sf-pro font-semibold text-[14px] flex gap-1 outline-none menu-ho rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/admin' ? '#70aaeb2c' : '',
                color: $route.path === '/admin' ? '#1b7be8' : '',
              }"
            >
              <i class="pi pi-users"></i>
              <span>Management</span>
            </Button>
            <Button
              class="text-black rounded-full h-10 w-10 mb-2 flex items-center justify-center menu-ho"
              :class="{ 'bg-[#70aaeb2c]': $route.path === '/admin' }"
              v-else
              icon="pi pi-users"
              link
            >
            </Button>
          </router-link>
          <router-link to="/emergency">
            <Button
              class="bg-[#f6f6f6] space-x-2 w-full text-[#f00] font-sf-pro font-semibold text-[14px] flex gap-1 underline-label menu-ho-emergency rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/emergency' ? '#fbcfcf' : '',
              }"
            >
              <i class="pi pi-exclamation-triangle"></i>
              <span>Emergency</span>
            </Button>
            <Button
              class="text-[#f00] rounded-full h-10 w-10 flex items-center justify-center -mt-2 menu-ho-emergency"
              :class="{
                'bg-[#ffcfcf] text-[#f00]': $route.path === '/emergency',
              }"
              v-else
              icon="pi pi-exclamation-triangle"
              link
            >
            </Button>
          </router-link>
        </ul>
      </div>

      <!-- searchfile -->
      <div v-if="$route.path === '/searchfile'">
        <div
          class="pt-5 text-lg font-semibold text-black flex pb-2 text-[18px] color-[#282828]"
        >
          Device
        </div>
        <div
          v-for="(item, index) in device"
          :key="index"
          class="flex align-items-center"
        >
          <div v-if="item.deviceName" class="flex gap-3 items-center">
            <Checkbox
              v-model="item.MACaddress"
              :inputId="item.deviceName"
              name="category"
              :value="item.deviceName"
            />
            <label :for="item.deviceName">{{ item.deviceName }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- <UserInfo /> -->
    <div
      class="flex h-14 w-full pl-2 pr-4 items-center justify-between"
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
        <div class="flex flex-col items-start font-normal text-[13px] left-14">
          <p v-if="user" class="font-bold">
            {{ user.firstName }} {{ (user?.lastName || "").charAt(0) }}.
          </p>
          <div class="-mt-1 text-[#0094ff] text-[13px] font-700">
            <p v-if="user?.isAdmin" class="pt-0.5 font-semibold">Admin</p>
          </div>
          <div class=" text-[#00AEA4] text-[13px] font-700">
            <p v-if="!user?.isAdmin" class="pt-0.5 font-semibold">Instructor</p>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <button
          @click="signOut()"
          class="pi pi-sign-out"
          style="color: red"
          :class="
            openSidebar
              ? 'px-0.5 menu-ho-emergency rounded-full h-10 w-10'
              : 'ml-3.5 rounded-full menu-ho-emergency-slide h-10 w-10'
          "
        />
      </div>
    </div>
  </div>
</template>

<style>
Button {
  box-shadow: none;
}

.menu-ho:hover {
  background-color: #70aaeb2c;
  color: #1b7be8;
}

.menu-ho-emergency:hover {
  background-color: #fbcfcf;
}

.menu-ho-emergency-slide:hover {
  background-color: #fbcfcf;
}

.logout-bt {
  width: 36px;
  height: 36px;
  border-radius: 11.52px;

  transition: 0.1s;
}
.logout-bt:hover {
  background: #ffcfcf;
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

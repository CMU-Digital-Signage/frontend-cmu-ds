<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SideBar",
});
</script>
<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import store from "@/store";
import { signOut, setPassword, changePassword, sendEmail } from "@/services";
import { useToast } from "primevue/usetoast";

const loading = ref(false);
const user = computed(() => store.state.userInfo);
const device = computed(() => store.state.devices);
const filterDevice = computed({
  get: () => store.state.filterDevice,
  set: (val) => (store.state.filterDevice = val),
});
const openSidebar = computed(() => store.state.openSidebar);
const toggleSidebar = () => {
  store.state.openSidebar = !openSidebar.value;
};
const menu = ref();
const oldPassword = ref("");
const password = ref("");
const cfPassword = ref("");
const toggle = (event: any) => {
  menu.value.toggle(event);
};

const toast = useToast();
const dialogSetPassword = ref(false);
const dialogVisible = ref(false); // dialog changePassword
const secondDialogVisible = ref(false); // dialog forgetPassword

watchEffect(() => {
  if (window.innerWidth <= 600) {
    store.state.openSidebar = false;
  }
});

onMounted(() => {
  dialogSetPassword.value = user.value.password === null;
});

const showDialog = () => {
  dialogVisible.value = true;
  resetChangeForm();
};

const sendEmailDialog = async () => {
  loading.value = true;
  const res = await sendEmail();

  if (res.ok) {
    setTimeout(() => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Email sent successfully.",
        life: 3000,
      });
      loading.value = false;
      secondDialogVisible.value = false;
    }, 5000);
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
    loading.value = false;
  }
};

const showSecondDialog = () => {
  dialogVisible.value = false;
  secondDialogVisible.value = true;
};

const items = ref([
  {
    label: "Change Emergency Password",
    icon: "pi pi-pencil",
    command: () => {
      showDialog();
    },
  },
  {
    label: "Log Out",
    icon: "pi pi-sign-out",
    command: () => {
      signOut();
    },
  },
]);

const resetChangeForm = () => {
  oldPassword.value = "";
  password.value = "";
  cfPassword.value = "";
};

const checkMatchPassword = async () => {
  if (!password.value.length || !cfPassword.value.length) {
    toast.add({
      severity: "error",
      summary: "Empty Password or Confirm Password",
      life: 3000,
    });
  } else if (password.value === cfPassword.value) {
    const res = await setPassword(password.value);
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Set Emergency Password successfully.",
        life: 3000,
      });
      store.state.userInfo.password = "already have password.";
    }
    dialogSetPassword.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: "Not Match",
      life: 3000,
    });
  }
};

const handleChangePassword = async () => {
  if (password.value.length || cfPassword.value.length) {
    if (password.value === cfPassword.value) {
      const res = await changePassword(oldPassword.value, password.value);
      if (res.ok) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Change Emergency Password successfully.",
          life: 3000,
        });
        dialogVisible.value = false;
        resetChangeForm();
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: res.message,
          life: 3000,
        });
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Not Match",
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Empty Password or Confirm Password",
      life: 3000,
    });
  }
};
</script>

<template>
  <div
    class="flex flex-col justify-between h-screen side-bar border-r-[1px] border-[#dddddd] z-10 sticky"
    :class="openSidebar == true ? 'side-bar-open pl-[4px]' : 'side-bar-close'"
  >
    <div class="space-y-5" :class="{ 'p-4 py-6': openSidebar }">
      <div
        class="flex justify-between items-start"
        :class="{ 'p-4 py-6': !openSidebar }"
      >
        <div>
          <div class="flex items-center gap-2 md:fixed">
            <img
              class="w-7 -mt-3"
              alt="cmulogo"
              src="../assets/images/logo close.png"
            />
            <div
              :class="{
                'font-medium text-[18px] lg:text-[20px] -mt-3': openSidebar,
              }"
              v-show="openSidebar"
            >
              <span
                class="bg-gradient-to-r from-blue-500 via-green-500 to-indigo-400 text-transparent bg-clip-text"
                >pixelParade</span
              >
            </div>
          </div>
        </div>
        <!-- Button collapsed -->
        <Button
          id="sideBarButton"
          @click="toggleSidebar()"
          link
          class="text-black bg-[#f6f6f600] rounded-full h-6 w-6 -mt-1 flex items-center justify-center menu-ho outline-none"
          :style="{
            transform: openSidebar ? '' : 'translateX(8px)',
            marginLeft: openSidebar ? '' : '-8px',
          }"
          v-if="!$route.meta.crossIconSidebar"
        >
          <i
            :class="{
              'pi pi-align-left': !openSidebar,
              'pi pi-align-right': openSidebar,
            }"
          ></i>
        </Button>

        <Button
          @click="$router.back"
          class="bg-[#f6f6f600] rounded-full h-6 w-6 flex -mt-1 text-[#575757] items-center justify-center menu-ho outline-none"
          v-else
          :style="{
            transform: openSidebar ? '' : 'translateX(8px) ',
            marginLeft: openSidebar ? '' : '-8px',
          }"
          link
        >
          <i class="pi pi-times"></i>
        </Button>
      </div>

      <!-- Upload Button -->
      <div :class="openSidebar == true ? '' : ' flex justify-center '">
        <Button
          v-if="openSidebar"
          label="Upload content"
          class="upload-button mt-[37px] items-center justify-center"
          @click="store.state.showUpload = true"
          :pt="{ label: { class: 'flex-none ml-3 text-white font-semibold' } }"
        >
          <template #icon>
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <rect fill="none" height="256" width="256" />

              <path
                d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="176"
                x2="176"
                y1="16"
                y2="64"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="200"
                x2="152"
                y1="40"
                y2="40"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="224"
                x2="224"
                y1="72"
                y2="104"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="240"
                x2="208"
                y1="88"
                y2="88"
              />
            </svg>
          </template>
        </Button>

        <Button
          class="text-[#282828] border-none drop-shadow-xl -mt-2 rounded-full h-10 w-10 flex menu-ho-upload"
          v-else
          style="
            background-image: linear-gradient(
              45deg,
              #57eb7f 0%,
              #3a9ad2 50%,
              #5386a4 100%
            );
          "
          @click="store.state.showUpload = true"
        >
          <template #icon>
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
            >
              <rect fill="none" height="256" width="256" />

              <path
                d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="176"
                x2="176"
                y1="16"
                y2="64"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="200"
                x2="152"
                y1="40"
                y2="40"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="224"
                x2="224"
                y1="72"
                y2="104"
              />
              <line
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="14"
                x1="240"
                x2="208"
                y1="88"
                y2="88"
              />
            </svg>
          </template>
        </Button>
      </div>

      <div
        v-if="$route.path !== '/search-content'"
        :class="{
          'pt-2': openSidebar,
          'pt-4 flex justify-center': !openSidebar,
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
              class="bg-transparent menu-ho w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 side-bar rounded-xl"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/' ? '#4bdbff4d' : '',
                color: $route.path === '/' ? '#297dbe' : '',
              }"
            >
              <i class="pi pi-microsoft"></i>
              <span class="text-[12px]">Dashboard</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{ 'bg-[#4bdbff4d] text-[#FFFFFF]': $route.path === '/' }"
              v-else
              link
              icon="pi pi-microsoft"
              :style="{
                'background-color': $route.path === '/' ? '#4bdbff4d' : '',
                color: $route.path === '/' ? '#297dbe' : '',
              }"
            >
            </Button>
          </router-link>

          <router-link to="/content">
            <div>
              <Button
                class="bg-transparent w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 menu-ho rounded-xl"
                v-if="openSidebar"
                link
                :style="{
                  'background-color':
                    $route.path === '/content' ? '#4bdbff4d' : '',
                  color: $route.path === '/content' ? '#297dbe' : '',
                }"
              >
                <i class="pi pi-file"></i>
                <span class="text-[12px]">Content</span>
              </Button>
              <Button
                class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
                :class="{
                  'bg-[#4bdbff4d] text-[#297dbe]': $route.path === '/content',
                }"
                v-else
                icon="pi pi-file"
                link
                :style="{
                  'background-color':
                    $route.path === '/content' ? '#4bdbff4d' : '',
                  color: $route.path === '/content' ? '#297dbe' : '',
                }"
              >
              </Button>
            </div>
          </router-link>

          <router-link to="/deviceManage">
            <Button
              class="bg-transparent w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 menu-ho rounded-xl"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/deviceManage' ? '#4bdbff4d' : '',
                color: $route.path === '/deviceManage' ? '#297dbe' : '',
              }"
            >
              <i class="pi pi-desktop"></i>
              <span class="text-[12px]">Device</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{
                'bg-[#4bdbff4d] text-[#297dbe]':
                  $route.path === '/deviceManage',
              }"
              v-else
              icon="pi pi-desktop"
              link
              :style="{
                'background-color':
                  $route.path === '/deviceManage' ? '#4bdbff4d' : '',
                color: $route.path === '/deviceManage' ? '#297dbe' : '',
              }"
            >
            </Button>
          </router-link>

          <router-link to="/emergency">
            <Button
              class="bg-transparent space-x-2 -mb-2 w-full text-[#f00] font-semibold text-[14px] flex gap-1 menu-ho-emergency rounded-xl"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/emergency' ? '#FF5B5B' : '',
                color: $route.path === '/emergency' ? '#FFFFFF' : '',
              }"
            >
              <i class="pi pi-exclamation-triangle"></i>
              <span class="text-[12px]">Emergency</span>
            </Button>
            <Button
              class="text-[#f00] text-[12px] rounded-full h-10 w-10 flex items-center justify-center menu-ho-emergency"
              :class="{
                'bg-[#ff5b5b] text-[#FFFFFF]': $route.path === '/emergency',
              }"
              v-else
              icon="pi pi-exclamation-triangle"
              link
              :style="{
                'background-color':
                  $route.path === '/emergency' ? '#ff5b5b' : '',
                color: $route.path === '/emergency' ? '#FFFFFF' : '',
              }"
            >
            </Button>
          </router-link>
        </ul>
      </div>

      <!-- admin management-->
      <div
        v-if="user?.isAdmin && $route.path !== '/search-content'"
        :class="openSidebar == true ? '' : ' flex justify-center '"
      >
        <p
          class="flex pb-1 mt-8 font-semibold text-[14px] text-[#615F5F]"
          v-show="openSidebar"
        >
          Admin
        </p>
        <ul
          class="flex flex-col py-1 space-y-2 gap-2 text-[15px] text-left"
          :class="openSidebar ? '' : 'justify-center mt-3'"
        >
          <router-link to="/admin">
            <Button
              class="bg-transparent space-x-2 -mb-2 w-full text-[#282828] font-semibold text-[14px] flex gap-1 outline-none menu-ho rounded-xl"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/admin' ? '#4bdbff4d' : '',
                color: $route.path === '/admin' ? '#297dbe' : '',
              }"
            >
              <i class="pi pi-users"></i>
              <span class="text-[12px]">Management</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{
                'bg-[#4bdbff4d] text-[#297dbe]': $route.path === '/admin',
              }"
              v-else
              icon="pi pi-user"
              link
              :style="{
                'background-color': $route.path === '/admin' ? '#4bdbff4d' : '',
                color: $route.path === '/admin' ? '#297dbe' : '',
              }"
            >
            </Button>
          </router-link>

          <router-link to="/glanceBarManage">
            <Button
              :class="[
                'bg-transparent border-white text-[#282828] menu-ho flex',
                {
                  'rounded-xl w-full h-9 space-x-2 font-semibold text-[12px] gap-1':
                    openSidebar,
                  'rounded-full w-10 h-10 items-center justify-center':
                    !openSidebar,
                  '!bg-[#4bdbff4d] !text-[#297dbe]':
                    $route.path === '/glanceBarManage',
                },
              ]"
              :label="openSidebar ? 'Glance bar' : undefined"
              :pt="{
                label: {
                  class: { 'flex-none flex translate-x-[-3px]': openSidebar },
                },
              }"
            >
              <template #icon>
                <svg
                  :class="{ 'flex -ml-[4px]': openSidebar }"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    id="🔍-Product-Icons"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="ic_fluent_phone_page_header_24_regular"
                      fill="currentColor"
                      fill-rule="nonzero"
                    >
                      <path
                        d="M15.75,2 C16.9926407,2 18,3.00735931 18,4.25 L18,19.75 C18,20.9926407 16.9926407,22 15.75,22 L8.25,22 C7.00735931,22 6,20.9926407 6,19.75 L6,4.25 C6,3.00735931 7.00735931,2 8.25,2 L15.75,2 Z M16.5,5.005 L7.5,5.005 L7.5,19.75 C7.5,20.1642136 7.83578644,20.5 8.25,20.5 L15.75,20.5 C16.1642136,20.5 16.5,20.1642136 16.5,19.75 L16.5,5.005 Z"
                        id="🎨Color"
                      ></path>
                    </g>
                  </g>
                </svg>
              </template>
            </Button>
          </router-link>
        </ul>
      </div>
      <!-- search-content -->
      <div v-if="$route.path === '/search-content'" class="pt-3">
        <div class="flex pb-3 font-semibold text-[14px] text-[#615F5F]">
          Device
        </div>
        <div
          v-for="(item, index) in device"
          :key="index"
          class="flex align-items-center text-[15px] ml-4"
        >
          <div
            v-if="item.deviceName"
            class="flex items-center text-[12px] gap-4 pb-3"
          >
            <Checkbox
              v-model="filterDevice"
              :value="item.MACaddress"
              :pt="{
                box: {
                  style: {
                    'border-color': `${item.color}`,
                    'background-color': filterDevice.includes(
                      item.MACaddress ? item.MACaddress : ''
                    )
                      ? `${item.color}`
                      : undefined,
                  },
                },
              }"
            />
            <label :for="item.deviceName"
              >{{ item.deviceName }}
              <span class="text-[#636262]">({{ item.room }})</span></label
            >
          </div>
        </div>
      </div>
    </div>

    <!-- <UserInfo /> -->
    <div :class="openSidebar == true ? '' : ' flex justify-center '">
      <Button
        @click="toggle"
        link
        aria-haspopup="true"
        aria-controls="overlay_menu"
        :class="
          openSidebar
            ? 'flex h-12 ml-1  -bottom-5 rounded-xl w-[94%] hover:bg-gray-300 items-center justify-between border-[1px] border-[#c2c2c2] '
            : 'text-[#282828] rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-300 translate-y-3'
        "
      >
        <div class="flex items-center">
          <div class="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 39 39"
              fill="none"
            >
              <path
                d="M10.0685 28.4131C11.4498 27.4186 12.9155 26.6327 14.4658 26.0553C16.0149 25.4768 17.693 25.1875 19.5 25.1875C21.3059 25.1875 22.984 25.4768 24.5342 26.0553C26.0834 26.6327 27.5492 27.4181 28.9315 28.4115C30.004 27.3022 30.8669 25.9913 31.5201 24.479C32.1734 22.9645 32.5 21.3048 32.5 19.5C32.5 15.8979 31.2341 12.8305 28.7024 10.2976C26.1706 7.76479 23.1032 6.49892 19.5 6.5C15.8979 6.5 12.8305 7.76642 10.2976 10.2992C7.76479 12.8321 6.49892 15.899 6.5 19.5C6.5 21.3059 6.82663 22.965 7.47988 24.4774C8.13313 25.9908 8.996 27.3027 10.0685 28.4131ZM19.5016 20.3125C18.1323 20.3125 16.9769 19.8423 16.0355 18.902C15.0952 17.9627 14.625 16.8085 14.625 15.4391C14.625 14.0698 15.0952 12.9144 16.0355 11.973C16.9748 11.0327 18.129 10.5625 19.4984 10.5625C20.8677 10.5625 22.0231 11.0327 22.9645 11.973C23.9048 12.9123 24.375 14.0665 24.375 15.4359C24.375 16.8052 23.9048 17.9606 22.9645 18.902C22.0252 19.8423 20.871 20.3125 19.5016 20.3125ZM19.5 34.125C17.4601 34.125 15.5507 33.7453 13.7719 32.9859C11.993 32.2275 10.445 31.1897 9.12763 29.8724C7.81138 28.555 6.77354 27.007 6.01412 25.2281C5.25471 23.4493 4.875 21.5399 4.875 19.5C4.875 17.4601 5.25471 15.5507 6.01412 13.7719C6.77246 11.993 7.81029 10.445 9.12763 9.12763C10.445 7.81138 11.993 6.77354 13.7719 6.01412C15.5507 5.25471 17.4601 4.875 19.5 4.875C21.5399 4.875 23.4493 5.25471 25.2281 6.01412C27.007 6.77246 28.555 7.81029 29.8724 9.12763C31.1886 10.445 32.2265 11.993 32.9859 13.7719C33.7453 15.5507 34.125 17.4601 34.125 19.5C34.125 21.5399 33.7453 23.4493 32.9859 25.2281C32.2275 27.007 31.1897 28.555 29.8724 29.8724C28.555 31.1886 27.007 32.2265 25.2281 32.9859C23.4493 33.7453 21.5399 34.125 19.5 34.125ZM19.5 32.5C20.9982 32.5 22.4721 32.2378 23.9216 31.7135C25.3722 31.1903 26.6256 30.4731 27.6819 29.562C26.6256 28.7148 25.4036 28.0448 24.0159 27.5519C22.6292 27.059 21.1239 26.8125 19.5 26.8125C17.8772 26.8125 16.367 27.0535 14.9695 27.5356C13.572 28.0177 12.3549 28.6932 11.3181 29.562C12.3744 30.472 13.6278 31.1892 15.0784 31.7135C16.5279 32.2378 18.0018 32.5 19.5 32.5ZM19.5 18.6875C20.4122 18.6875 21.1819 18.3739 21.8091 17.7466C22.4364 17.1194 22.75 16.3497 22.75 15.4375C22.75 14.5253 22.4364 13.7556 21.8091 13.1284C21.1819 12.5011 20.4122 12.1875 19.5 12.1875C18.5878 12.1875 17.8181 12.5011 17.1909 13.1284C16.5636 13.7556 16.25 14.5253 16.25 15.4375C16.25 16.3497 16.5636 17.1194 17.1909 17.7466C17.8181 18.3739 18.5878 18.6875 19.5 18.6875Z"
                fill="black"
              />
            </svg>
            <div v-show="openSidebar">
              <div v-if="user" class="flex flex-col items-start text-[12px]">
                <label class="font-bold text-black whitespace-nowrap">
                  {{ user.firstName }} {{ (user?.lastName || "").charAt(0) }}.
                </label>
                <label
                  class="font-semibold"
                  :class="{
                    'text-[#0094ff]': user?.isAdmin,
                    'text-[#2b8a85]': !user?.isAdmin,
                  }"
                >
                  {{ user?.isAdmin ? "Admin" : "Instructor" }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true"
          class="rounded-xl text-[14px]"
        />
      </Button>
    </div>

    <!-- //dialog reset password -->
    <Dialog
      v-model:visible="dialogVisible"
      class="h-auto w-[500px]"
      modal
      :close-on-escape="false"
      :draggable="false"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;  ',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px;  ',
        },
      }"
    >
      <template #header>
        <div class="header-popup">Change Emergency Password</div>
      </template>
      <div class="text-[14px] mb-8 text-[#049a7e] font-semibold">
        pixelParade | {{ user.firstName }} {{ user.lastName }}
      </div>
      <div class="flex flex-col gap-1 w-full">
        <label for="currentPassword" class="text-[12px] flex text-center"
          >Current Password</label
        >
        <Password
          id="currentPassword"
          placeholder="••••••••••"
          v-model="oldPassword"
          input-class="w-screen rounded-[8px] bg-[#eeeeee] border-none text-[12px] "
          class="w-full mb-3 h-9"
          :feedback="false"
          toggle-mask
          :pt="{
            input: {
              class: ` text-[12px]`,
            },
          }"
        />

        <label class="text-[12px] flex text-center" for="newPassword"
          >New Password</label
        >
        <Password
          id="newPassword"
          v-model="password"
          input-class="w-screen rounded-[8px] bg-[#eeeeee] border-none text-[12px] "
          class="w-full mb-3 h-9"
          :feedback="false"
          placeholder="••••••••••"
          toggle-mask
          :pt="{
            input: {
              class: ` text-[12px]`,
            },
          }"
        />
        <label class="text-[12px] flex text-center" for="reTypeNewPassword"
          >Re-type new password</label
        >
        <Password
          id="reTypeNewPassword"
          placeholder="••••••••••"
          input-class="w-screen rounded-[8px] bg-[#eeeeee] border-none text-[12px] "
          class="w-full h-9"
          v-model="cfPassword"
          :feedback="false"
          toggle-mask
          :pt="{
            input: {
              class: ` text-[12px]`,
            },
          }"
        />

        <Button
          text
          link
          @click="showSecondDialog"
          class="-ml-3 mb-8 w-fit font-normal text-[12px] text-[#049a7e] bg-transparent hover:underline"
          >Forget your password?</Button
        >
        <Button
          label="Change Password"
          text
          :class="'primaryButton'"
          @click="handleChangePassword"
          :pt="{ label: { class: 'text-[14px]' } }"
        ></Button></div
    ></Dialog>
    <Dialog
      modal
      v-model:visible="secondDialogVisible"
      :draggable="false"
      :close-on-escape="false"
      class="h-auto w-[550px]"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px;  ',
        },
      }"
      ><template #header>
        <div class="header-popup">Forget Emergency Password</div>
      </template>
      <p v-if="user" class="text-[14px] mb-8">
        We'll send a password reset confirmation to
        <span class="text-[#049a7e] font-extrabold">{{ user.email }}</span>
        Check your inbox (including Spam and Junk). It may take 1-2 minutes for
        the email to arrive.
      </p>
      <Button
        label="Send Email"
        :loading="loading"
        text
        @click="sendEmailDialog"
        :class="'primaryButton'"
        :pt="{ label: { class: 'text-[14px]' } }"
      ></Button>
    </Dialog>

    <!-- //dialog Set Password -->
    <Dialog
      v-model:visible="dialogSetPassword"
      class="w-[500px]"
      modal
      :close-on-escape="false"
      :draggable="false"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px;  ',
        },
      }"
      :closable="false"
    >
      <template #header>
        <div class="flex flex-col">
          <div class="header-popup">Set your emergency password</div>
        </div>
      </template>

      <div class="mb-4 gap-7 rounded-xl h-fit">
        <div class="text-[14px] text-[#049a7e] font-semibold">
          pixelParade | {{ user.firstName }} {{ user.lastName }}
        </div>
        <div class="text-[12px] mt-2 mb-8 font-medium text-[#828282]">
          pixelParade includes an Emergency Activation feature to display
          emergency posters on all screens.
          <span class="font-bold text-black">
            Set your Emergency Password to activate this feature during an
            incident.
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full">
        <label
          class="text-[12px] flex font-semibold text-center"
          for="newPassword"
          >Password</label
        >
        <Password
          id="Password"
          v-model="password"
          input-class="w-screen rounded-[8px] bg-[#eeeeee] border-none text-[12px] "
          class="w-full mb-3 h-9"
          :feedback="false"
          toggle-mask
          placeholder="••••••••••"
        />
        <label class="text-[12px] flex text-center" for="reTypeNewPassword"
          >Confirm password</label
        >
        <Password
          id="confirmPassword"
          input-class="w-screen rounded-[8px] text-[12px] bg-[#eeeeee] border-none"
          class="w-full mb-5 h-9"
          v-model="cfPassword"
          :feedback="false"
          toggle-mask
          placeholder="••••••••••"
        />

        <div class="flex flex-inline gap-4 pt-3">
          <Button
            label="Later, Log Out"
            text
            @click="signOut()"
            :class="'primaryButtonDel'"
            type="submit"
          ></Button>
          <Button
            label="Confirm"
            text
            @click="checkMatchPassword"
            :class="'primaryButton1 justify-center'"
            type="submit"
          ></Button>
        </div></div
    ></Dialog>
  </div>
</template>

<style scoped>
Button {
  box-shadow: none;
}

.menu-ho:hover {
  background-color: #a4a4a458;
  color: #282828;
}

.menu-ho3:hover {
  background-color: #cfcfcf58;
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

.side-bar {
  transition: all 300ms ease-in-out;
}

.side-bar-open {
  width: 16.5rem;
  height: 100%;
  padding-bottom: 37px;
}
.side-bar-close {
  width: 90px;
  height: 100%;
  padding-bottom: 37px;
}

.p-inputtext.p-component.p-password-input {
  width: 100%;
}

.primaryButton1 {
  width: 50%;
  border-width: 0;
  border-radius: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  background-color: #14c6a4;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.secondaryButton1 {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-right: 10px;
  background-color: none;
  color: rgb(255, 0, 0);
  cursor: pointer;
}

.primaryButton1:hover {
  cursor: pointer;
  background-color: #0eb092;
}

.secondaryButton1:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.primaryButton {
  width: 100%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #14c6a4;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 12px;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: #0eb092;
}

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  background-color: white;
  color: rgb(255, 91, 91);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButtonDel:hover {
  background-color: rgb(255, 235, 235);
}

.secondaryButton {
  width: 100%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-right: 10px;
  background-color: none;
  color: rgb(255, 0, 0);
  cursor: pointer;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: #049a7e;
}

.upload-button {
  color: rgb(54, 54, 54);
  width: 100%;
  border: none;
  border-radius: 2rem;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center; /* Center text horizontally */
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease-out;
  background-image: linear-gradient(
    45deg,
    #57eb7f 0%,
    #3a9ad2 50%,
    #5386a4 100%
  );
  box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 8px;
}

.upload-button:hover {
  animation: pulse 1s infinite linear;
  transform: scale(1.02);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(153, 255, 253, 0.8),
      0 0 25px rgba(167, 252, 217, 0.8), 0 0 35px rgba(155, 202, 228, 0.8),
      0 0 20px rgba(192, 230, 252, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(153, 255, 253, 0.8),
      0 0 25px rgba(167, 252, 217, 0.8), 0 0 50px rgba(155, 202, 228, 0.8),
      0 0 30px rgba(192, 230, 252, 0.8);
  }
}

.upload-button:active {
  transform: scale(0.95);
}

.upload-button:focus {
  outline: none;
}

.upload-button.jelly {
  animation: jelly 0.5s;
}

@keyframes jelly {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.05);
  }
}

.menu-ho-upload {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: none;
}

.menu-ho-upload:hover {
  box-shadow: 0px 0px 10px 2px rgba(62, 136, 172, 0.5);
  background-color: #006a56;
}
</style>

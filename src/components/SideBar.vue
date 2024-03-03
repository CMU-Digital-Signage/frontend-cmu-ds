<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "SideBar",
});
</script>
<script setup lang="ts">
import { computed, watch, watchEffect, onMounted } from "vue";
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
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Send email successfull.",
      life: 3000,
    });
    loading.value = false;
    secondDialogVisible.value = false;
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
    class="flex flex-col justify-between h-screen side-bar z-10 sticky border-gray-100 border-r-[2px]"
    :class="openSidebar == true ? 'side-bar-open pl-[4px]' : 'side-bar-close'"
  >
    <div class="space-y-5" :class="{ 'p-4': openSidebar }">
      <div
        class="flex justify-between items-start"
        :class="{ 'p-4': !openSidebar }"
      >
        <div>
          <div class="flex items-center gap-2 md:fixed">
            <img
              class="w-6"
              alt="cmulogo"
              src="../assets/images/cpe-mini-logo.png"
            />
            <p
              :class="{ 'font-medium text-[18px] lg:text-[20px]': openSidebar }"
              v-show="openSidebar"
            >
              pixelParade
            </p>
          </div>
        </div>
        <!-- Button collapsed -->
        <Button
          id="sideBarButton"
          @click="toggleSidebar()"
          link
          class="text-black bg-[#f6f6f600] rounded-full h-6 w-6 flex items-center justify-center menu-ho outline-none"
          :style="{
            transform: openSidebar ? '' : 'translateX(8px)',
            marginLeft: openSidebar ? '' : '-8px',
            marginTop: openSidebar ? '2px' : '-2px',
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
          class="text-black bg-[#f6f6f600] rounded-full h-6 w-6 flex items-center justify-center menu-ho outline-none"
          v-else
          :style="{
            transform: openSidebar ? '' : 'translateX(8px)',
            marginLeft: openSidebar ? '' : '-8px',
            marginTop: openSidebar ? '2px' : '-2px',
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
          icon="pi pi-plus"
          class="upload-button mt-7"
          @click="store.state.showUpload = true"
   
        >
          <div
            class="h-6 w-6 mr-2 rounded-full bg-[#039BE5] flex items-center justify-center border-none"
          >
            <i class="pi pi-plus text-white"></i>
          </div>
          <span>Upload</span>
        </Button>
        <Button
          class="text-[#282828] bg-[#039BE5] border-none drop-shadow-xl rounded-full h-10 w-10 flex menu-ho-upload"
          v-else
          @click="store.state.showUpload = true"
          icon="pi pi-plus"
          ><i class="pi pi-plus text-white"></i
        ></Button>
      </div>

      <div
        v-if="$route.path !== '/searchfile'"
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
              class="bg-none menu-ho w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 side-bar rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/' ? '#2E3F4A' : '',
                color: $route.path === '/' ? '#FFFFFF' : '',
              }"
            >
              <i class="pi pi-microsoft"></i>
              <span>Dashboard</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{ 'bg-[#2E3F4A] text-[#FFFFFF]': $route.path === '/' }"
              v-else
              link
              icon="pi pi-microsoft"
              :style="{
                'background-color': $route.path === '/' ? '#2E3F4A' : '',
                color: $route.path === '/' ? '#FFFFFF' : '',
              }"
            >
            </Button>
          </router-link>

          <router-link to="/file">
            <div>
              <Button
                class="bg-none w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 menu-ho rounded-lg"
                v-if="openSidebar"
                link
                :style="{
                  'background-color': $route.path === '/file' ? '#2E3F4A' : '',
                  color: $route.path === '/file' ? '#FFFFFF' : '',
                }"
              >
                <i class="pi pi-file"></i>
                <span>File</span>
              </Button>
              <Button
                class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
                :class="{
                  'bg-[#2E3F4A] text-[#FFFFFF]': $route.path === '/file',
                }"
                v-else
                icon="pi pi-file"
                link
                :style="{
                  'background-color': $route.path === '/file' ? '#2E3F4A' : '',
                  color: $route.path === '/file' ? '#FFFFFF' : '',
                }"
              >
              </Button>
            </div>
          </router-link>

          <router-link to="/deviceManage">
            <Button
              class="bg-none w-full space-x-2 text-[#282828] font-semibold text-[14px] flex gap-1 menu-ho rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/deviceManage' ? '#2E3F4A' : '',
                color: $route.path === '/deviceManage' ? '#FFFFFF' : '',
              }"
            >
              <i class="pi pi-desktop"></i>
              <span>Device</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{
                'bg-[#2E3F4A] text-[#FFFFFF]': $route.path === '/deviceManage',
              }"
              v-else
              icon="pi pi-desktop"
              link
              :style="{
                'background-color':
                  $route.path === '/deviceManage' ? '#2E3F4A' : '',
                color: $route.path === '/deviceManage' ? '#FFFFFF' : '',
              }"
            >
            </Button>
          </router-link>
        </ul>
      </div>

      <!-- admin management-->
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
          :class="openSidebar ? '' : 'justify-center mt-3'"
        >
          <router-link to="/admin">
            <Button
              class="bg-none space-x-2 w-full text-[#282828] font-semibold text-[14px] flex gap-1 outline-none menu-ho rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color': $route.path === '/admin' ? '#2E3F4A' : '',
                color: $route.path === '/admin' ? '#FFFFFF' : '',
              }"
            >
              <i class="pi pi-users"></i>
              <span>Management</span>
            </Button>
            <Button
              class="text-[#282828] rounded-full h-10 w-10 flex items-center justify-center menu-ho"
              :class="{
                'bg-[#2E3F4A] text-[#FFFFFF]': $route.path === '/admin',
              }"
              v-else
              icon="pi pi-user"
              link
              :style="{
                'background-color': $route.path === '/admin' ? '#2E3F4A' : '',
                color: $route.path === '/admin' ? '#FFFFFF' : '',
              }"
            >
            </Button>
          </router-link>

          <router-link to="/emergency">
            <Button
              class="bg-none space-x-2 w-full text-[#f00] font-semibold text-[14px] flex gap-1 underline-label menu-ho-emergency rounded-lg"
              v-if="openSidebar"
              link
              :style="{
                'background-color':
                  $route.path === '/emergency' ? '#FF5B5B' : '',
                color: $route.path === '/emergency' ? '#FFFFFF' : '',
              }"
            >
              <i class="pi pi-exclamation-triangle"></i>
              <span>Emergency</span>
            </Button>
            <Button
              class="text-[#f00] rounded-full h-10 w-10 flex items-center justify-center menu-ho-emergency"
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

      <!-- searchfile -->
      <div v-if="$route.path === '/searchfile'" class="pt-3">
        <div class="flex pb-3 font-semibold text-[14px] text-[#615F5F]">
          Device
        </div>
        <div
          v-for="(item, index) in device"
          :key="index"
          class="flex align-items-center text-[15px] ml-4"
        >
          <div v-if="item.deviceName" class="flex items-center gap-3 pb-3">
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
            <label :for="item.deviceName">{{ item.deviceName }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- <UserInfo /> -->
    <div
      class="flex h-14 w-full pl-2 pr-4 items-center"
      :class="openSidebar ? 'justify-between' : 'justify-center'"
      style="border-top: 1px solid #c2c2c2"
    >
      <div class="flex items-center">
        <div
          class="flex flex-row gap-2 items-center fixed"
          v-show="openSidebar"
        >
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
          <div
            class="flex flex-col items-start font-normal text-[13px] left-14"
          >
            <p v-if="user" class="font-bold">
              {{ user.firstName }}
              {{ (user?.lastName || "").charAt(0) }}.
            </p>
            <div class="-mt-1 text-[#0094ff] text-[13px] font-700">
              <p v-if="user?.isAdmin" class="pt-0.5 font-semibold">Admin</p>
            </div>
            <div class="text-[#00AEA4] text-[13px] font-700">
              <p v-if="!user?.isAdmin" class="pt-0.5 font-semibold">
                Instructor
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <Button
          text
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-angle-up"
          :style="{
            transform: openSidebar ? 'translateX(-10px)' : 'translateX(3px)',
          }"
          :class="
            openSidebar
              ? '  rounded-full translateX(-3px) w-10'
              : ' rounded-full  translateX(-3px) w-10'
          "
        />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

        <!-- //dialog reset password -->
        <Dialog
          v-model:visible="dialogVisible"
          class="h-auto w-[550px]"
          modal
          :close-on-escape="false"
          :draggable="false"
          :pt="{
            content: {
              style:
                'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
            },
            header: {
              style:
                'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
            },
            mask: {
              style: 'backdrop-filter: blur(2px)',
            },
          }"
        >
          <template #header>
            <div class="header-popup">Change Emergency Password</div>
          </template>

          <p v-if="user" class="text-[#0067A0] text-lg mb-2 font-semibold">
            {{ user.firstName }} {{ user.lastName }}
          </p>
          <div class="flex flex-col gap-2 w-full">
            <FloatLabel class="mt-6">
              <Password
                id="currentPassword"
                v-model="oldPassword"
                input-class="w-screen rounded-[12px] border-2"
                class="w-full"
                :feedback="false"
                toggle-mask
              />
              <label for="currentPassword">Current Password</label>
            </FloatLabel>
            <FloatLabel class="mt-6">
              <Password
                id="newPassword"
                v-model="password"
                input-class="w-screen rounded-[12px] border-2"
                class="w-full"
                :feedback="false"
                toggle-mask
              />
              <label for="newPassword">New Password</label>
            </FloatLabel>
            <FloatLabel class="mt-6">
              <Password
                id="reTypeNewPassword"
                input-class="w-screen rounded-[12px] border-2"
                class="w-full"
                v-model="cfPassword"
                :feedback="false"
                toggle-mask
              />
              <label for="reTypeNewPassword">Re-type new password</label>
            </FloatLabel>
            <Button
              text
              link
              @click="showSecondDialog"
              class="-ml-3 w-fit underline font-semibold text-[#1b7be8] bg-none"
              >Forget your password?</Button
            >
            <Button
              label="Change Password"
              text
              :class="'primaryButton'"
              @click="handleChangePassword"
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
                'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
            },
            header: {
              style:
                'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
            },
            mask: {
              style: 'backdrop-filter: blur(2px)',
            },
          }"
          ><template #header>
            <div class="header-popup">Forget Emergency Password</div>
          </template>
          <p v-if="user" class="mb-6">
            {{ user.firstName }} {{ user.lastName }} · CPE pixelParade
          </p>
          <p v-if="user">
            We'll send a password reset confirmation to
            <span class="text-[#1b7be8] font-extrabold underline">{{
              user.email
            }}</span>
            Check your inbox (including Spam and Junk) to reset your emergency
            password.
          </p>
          <Button
            label="Send Email"
            :loading="loading"
            text
            @click="sendEmailDialog"
            :class="'primaryButton'"
          ></Button>
        </Dialog>

        <!-- //dialog Set Password -->
        <Dialog
          v-model:visible="dialogSetPassword"
          class="w-[550px]"
          modal
          :close-on-escape="false"
          :draggable="false"
          :pt="{
            content: {
              style:
                'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
            },
            header: {
              style:
                'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
            },
            mask: {
              style: 'backdrop-filter: blur(2px)',
            },
          }"
          :closable="false"
        >
          <template #header>
            <div class="header-popup">Set Your Emergency Password</div>
          </template>
          <div class="mb-6 gap-7 bg-[#C7EBFF] rounded-lg h-fit p-4">
            <div class="inline-flex">
              <i
                class="pi pi-info-circle mb-1 mr-2 text-[#0067A0] text-3xl"
              ></i>
              <p v-if="user" class="text-xl mb-2 font-bold text-[#0067A0]">
                Hello! {{ user.firstName }} {{ user.lastName }}
              </p>
            </div>
            <p class="ml-9">
              CPE pixelParade provides an Emergency Activation feature, as
              shown on the login page, to display emergency posters on all
              screens.
              <span class="font-bold text-black">
                Before using this website, please set your Emergency Password.
                This password is used to activate the emergency poster during an
                incident.</span
              >
            </p>
          </div>

          <label class="text-[17px] w- font-semibold pt-2 w-32"> </label>
          <div class="flex flex-col gap-2 w-full">
            <FloatLabel class="mt-4">
              <Password
                id="Password"
                v-model="password"
                input-class="w-screen rounded-[12px] border-2"
                class="w-full"
                :feedback="false"
                toggle-mask
              />
              <label for="newPassword">Password</label>
            </FloatLabel>
            <FloatLabel class="mt-6">
              <Password
                id="confirmPassword"
                input-class="w-screen rounded-[12px] border-2"
                class="w-full"
                v-model="cfPassword"
                :feedback="false"
                toggle-mask
              />
              <label for="reTypeNewPassword">Confirm password</label>
            </FloatLabel>
            <div class="inline-flex">
              <Button
                label="Later, Log Out"
                text
                @click="signOut()"
                :class="'secondaryButton1'"
                type="submit"
              ></Button>
              <Button
                label="Confirm"
                text
                @click="checkMatchPassword"
                :class="'primaryButton1'"
                type="submit"
              ></Button>
            </div></div
        ></Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
Button {
  box-shadow: none;
}

.menu-ho:hover {
  background-color: #cfcfcf58;
  color: #282828;
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
  transition: all 300ms ease-in-out;
}

.side-bar-open {
  width: 18rem;
}
.side-bar-close {
  width: 90px;
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
  margin-top: 30px;
  margin-left: 10px;
  background-color: rgb(74, 158, 255);
  color: rgb(255, 255, 255);
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
  background-color: rgb(9, 120, 247);
  text-decoration-line: underline;
}

.secondaryButton1:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.primaryButton {
  width: 100%;
  border-width: 0;
  border-radius: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  background-color: rgb(74, 158, 255);
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
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

.primaryButton:hover {
  cursor: pointer;
  background-color: rgb(9, 120, 247);
  text-decoration-line: underline;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.header-popup {
  font-weight: 700;
  font-size: 22px;
  color: black;
}

.upload-button {
  background-color: #ffffffc2;
  color: rgb(54, 54, 54);
  width: 70%;
  border: none;
  border-radius: 0.8rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  box-shadow: 0px 0px 7px 0px #888888;
}

.upload-button:hover {
  box-shadow: 0px 0px 10px 0px #505050;
  background-color: #f8f8f8;
}

.menu-ho-upload {
  box-shadow: 0px 0px 7px 0px #888888;
  border: none
}

.menu-ho-upload:hover {
  box-shadow: 0px 0px 10px 0px #505050;
  background-color: rgb(9, 120, 247);
}
</style>

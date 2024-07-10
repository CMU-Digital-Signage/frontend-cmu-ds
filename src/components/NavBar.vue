<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBar",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { computed, reactive, ref, watchEffect, defineProps } from "vue";
import { useToast } from "primevue/usetoast";
import router from "@/router";
import { addAdmin, searchPoster } from "@/services";
import { typePoster, statusPoster, statusEmer } from "@/utils/constant";
import { TYPE } from "@/utils/enum";
import { Poster } from "@/types";
import ModalAddEditDevice from "@/components/Modal/ModalAddEditDevice.vue";

const filterInput = computed(() => store.state.filterInputPosters);
const user = computed(() => store.state.userInfo);
const devices = computed(() => store.state.devices);
const showPopup = ref(false);
const showPopupAddDevice = ref(false);
const currentViewDate = computed(() => store.state.currentViewDate);
const viewType = computed(() => store.state.viewType);
const clickSearch = ref(false);
const searchP = ref<string>("");
const loading = ref(false);
const toast = useToast();

const selectDevice = computed({
  get: () => store.state.selectDevice,
  set: (val) => (store.state.selectDevice = val),
});
const Emer = defineProps({ types: String });
const email = ref<string>("");
const devicePreview = computed(() =>
  store.state.devices?.find(
    (e) => e.MACaddress === router.currentRoute.value.params.mac
  )
);
const panel = ref();

watchEffect(() => {
  if (router.currentRoute.value.path === "/search-content") {
    clickSearch.value = true;
  } else {
    clickSearch.value = false;
    searchP.value = "";
  }
  if (router.currentRoute.value.path === "/") {
    store.state.viewType = true;
  }
});

const goToSearch = () => {
  store.state.openSidebar = true;
  clickSearch.value = true;
  router.push("/search-content");
};

const search = async () => {
  store.state.searchPosters = [];
  store.state.loading = true;
  const res = await searchPoster(searchP.value);
  if (res.ok) {
    res.poster.forEach((e: Poster) => {
      e.createdAt = new Date(e.createdAt);
      e.updatedAt = new Date(e.updatedAt);
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      e.startTime = new Date(e.startTime);
      e.endTime = new Date(e.endTime);
    });
    res.poster.sort(
      (a: Poster, b: Poster) => a.startDate.getTime() - b.startDate.getTime()
    );
    store.state.searchPosters = res.poster;
  }
  store.state.loading = false;
};

const addEmailAdmin = async () => {
  loading.value = true;
  const alreadyAdmin = store.state.allUser?.find(
    (e) => e.email === email.value
  );
  if (alreadyAdmin?.isAdmin) {
    toast.add({
      severity: "error",
      summary: "Already admin",
      detail: `${alreadyAdmin.email} is already an admin`,
      life: 3000,
    });
    return;
  }
  const newAdmin = await addAdmin(email.value);
  if (newAdmin.ok) {
    showPopup.value = false;
    toast.add({
      severity: "success",
      summary: "Add success",
      detail: `${email.value} is an admin`,
      life: 3000,
    });
  }
  email.value = "";
  loading.value = false;
};

const validateEmail = () => {
  return /^\S+@cmu\.ac\.th$/i.test(email.value);
};

const toggleOverlay = (e: any) => {
  panel.value.toggle(e);
};

const closeModalAddEditDevice = () => {
  showPopupAddDevice.value = false;
};
</script>

<template>
  <div
    class="h-16 px-6 inline-flex flex-wrap items-center z-10 border-b-[1px] border-[#dddddd] py-3 font-semibold font-sf-pro text-[#575757] text-[16px]"
  >
    <Toast />
    <!-- Popup Add Device -->
    <ModalAddEditDevice
      :show="showPopupAddDevice"
      :onClose="closeModalAddEditDevice"
    />
    <!-- "Management" -->
    <ul v-if="$route.path === '/admin'">
      <p>Management</p>
      <div
        class="ml-auto cursor-pointer justify-between"
        v-if="store.state.selectTabview === 0"
      >
        <Button
          label="Add Admin"
          icon="pi pi-plus text-white p-1 rounded-full bg-[#039BE5] ml-1"
          class="flex text-black pr-2 pl-1 py-1.5 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold bg-white hover:bg-gray-200"
          @click="showPopup = true"
          :pt="{
            label: 'text-[14px]',
          }"
        >
        </Button>
        <Dialog
          v-model:visible="showPopup"
          class="h-auto"
          modal
          close-on-escape
          :draggable="false"
          @after-hide="email = ''"
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
        >
          <template #header>
            <div class="header-popup">Add Admin</div>
          </template>
          <form @submit.prevent="addEmailAdmin" class="flex flex-row gap-2">
            <div class="flex flex-col gap-2">
              <label class="text-[14px] text-[#282828] font-semibold pt-2 w-32"
                >CMU account
              </label>
              <InputText
                class="h-8 w-96 rounded-[8px] text-[12px]"
                placeholder="example@cmu.ac.th"
                type="text"
                v-model="email"
              ></InputText>

              <div class="flex flex-row gap-4 pt-3">
                <Button
                  label="Cancel"
                  text
                  @click="showPopup = false"
                  :class="'secondaryButton'"
                ></Button>
                <Button
                  icon="pi pi-plus"
                  :class="'primaryButton justify-center'"
                  :pt="{ label: { class: 'flex-none mr-2' } }"
                  label="Add"
                  type="submit"
                  :disabled="!email.length || !validateEmail()"
                ></Button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
      <div
        class="ml-auto cursor-pointer justify-between"
        v-if="store.state.selectTabview === 1"
      >
        <Button
          label="Add Device"
          icon="pi pi-plus text-white p-1 rounded-full bg-[#039BE5] ml-1"
          class="flex bg-while text-black pr-2 pl-1 text-[14px] py-1.5 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold bold-ho bg-white hover:bg-gray-200"
          @click="showPopupAddDevice = true"
        >
        </Button>
      </div>
    </ul>

    <!-- "Emergency" -->
    <ul v-if="$route.path === '/emergency'">
      <router-link to="/login" v-if="Emer.types === 'Outside'">
        <Button
          icon="pi pi-arrow-left"
          class="flex justify-center border-0 text-black rounded-md bg-white hover:bg-gray-200 mr-3"
        >
        </Button>
      </router-link>
      <p class="text-[#FF0000]">Emergency Activation</p>
    </ul>

    <!-- "Device" -->
    <ul v-if="$route.path === '/deviceManage'">
      <p>Device</p>
      <div class="ml-auto justify-between">
        <Button
          v-if="user.isAdmin"
          label="Add Device"
          icon="pi pi-plus text-white p-1 rounded-full bg-[#039BE5] ml-1"
          class="flex bg-while text-black pr-2 pl-1 py-1.5 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold bg-white hover:bg-gray-200"
          @click="showPopupAddDevice = true"
          :pt="{
            label: 'text-[14px]',
          }"
        >
        </Button>
      </div>
    </ul>

    <!-- Preview -->
    <ul
      v-if="$route.path.includes('/preview') && devicePreview"
      class="justify-between"
    >
      <div class="inline-flex gap-3 items-center justify-center">
        <p>{{ devicePreview.deviceName }}</p>
        <i
          class="pi pi-info-circle cursor-pointer text-[14px]"
          @mouseover="toggleOverlay"
          @mouseleave="toggleOverlay"
        />
        <OverlayPanel
          ref="panel"
          class="w-fit h-fit max-w-md max-h-max text-[12px]"
        >
          <table>
            <tr>
              <td>MAC Address</td>
              <td>{{ devicePreview.MACaddress }}</td>
            </tr>
            <tr>
              <td>Room</td>
              <td>{{ devicePreview.room }}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{{ devicePreview.description || "-" }}</td>
            </tr>
          </table>
        </OverlayPanel>
      </div>
      <div class="inline-flex gap-3 items-center justify-center">
        <label class="text-[12px] lg:text-[14px]">Date</label>
        <Calendar
          v-model="filterInput.date"
          :manualInput="false"
          showIcon
          iconDisplay="input"
          :minDate="new Date('2024-03-01')"
          dateFormat="dd M yy"
          inputClass="text-[12px] lg:text-[14px] rounded-lg"
          class="w-[120px] lg:w-[150px] h-8 align-middle"
        />

        <label class="text-[12px] lg:text-[14px]">Time</label>
        <Calendar
          v-model="filterInput.time"
          showIcon
          iconDisplay="input"
          icon="pi pi-clock"
          timeOnly
          :stepMinute="30"
          inputClass="text-[12px] lg:text-[14px] rounded-lg"
          class="w-[80px] lg:w-[90px] h-8 align-middle"
        />
        <Button
          label="Now"
          class="text-white items-center font-bold rounded-[8px] border-none max-h-fit px-3 py-1 border-2 bg-green-500 hover:bg-green-600"
          @click="store.commit('resetFilter')"
        />
      </div>
    </ul>

    <!-- "Content Manage" -->
    <ul
      v-if="$route.path === '/content'"
      class="flex-wrap xl:gap-2 md:gap-2 text-[14px] xl:text-[16px] md:text-[15px]"
    >
      <li>
        <label
          class="text-[12px] md:ml-[7px] mr-1 xl:text-[14px] md:text-[10px]"
          >Title</label
        >
        <InputText
          id="title"
          v-model="filterInput.title"
          class="border text-[13px] font-normal border-[#C6C6C6] pl-3 ml-1 h-7 py-4 md:w-28 xl:w-32 rounded-lg"
          placeholder="Ex.CPE Music"
        ></InputText>
      </li>
      <li v-if="store.state.selectTabview !== 1">
        <label
          class="text-[12px] md:ml-[7px] ml-[12px] mr-1 xl:text-[14px] md:text-[10px]"
          >Uploader</label
        >
        <InputText
          id="uploader"
          v-model="filterInput.uploader"
          class="border text-[13px] font-normal border-[#C6C6C6] pl-3 ml-1 h-7 py-4 md:w-28 xl:w-32 rounded-lg"
          placeholder="Ex.Navadon"
        ></InputText>
      </li>

      <li v-if="store.state.selectTabview !== 1">
        <label
          class="text-[12px] md:ml-[7px] ml-[12px] mr-1 xl:text-[14px] md:text-[10px]"
          >Upload Date
        </label>
        <Calendar
          v-model="filterInput.uploadDate"
          showButtonBar
          :manualInput="false"
          showIcon
          iconDisplay="input"
          inputId="icondisplay"
          dateFormat="dd M yy"
          inputClass="text-[13px] lg:text-[16px]"
          class="w-[90px] md:w-[100px] xl:w-[120px] h-8 rounded-lg align-middle"
          :pt="{
            input: { class: ` text-[10px] ` },
          }"
        />
      </li>
      <li v-if="store.state.selectTabview === 0">
        <label
          class="text-[12px] ml-[12px] md:ml-[7px] mr-1 xl:text-[14px] md:text-[10px]"
        >
          Type
        </label>
        <Dropdown
          v-model="filterInput.type"
          :options="typePoster"
          optionLabel="type"
          optionValue="type"
          inputClass="text-[13px] lg:text-[16px] text-left"
          :showClear="filterInput.status !== null"
          class="rounded-lg items-center h-8 w-24 md:w-38 xl:w-32"
        >
          <template #option="slotProps">
            <Tag
              rounded
              :icon="`pi pi-${
                slotProps.option.type === TYPE.POSTER
                  ? 'images'
                  : slotProps.option.type === TYPE.VIDEO
                  ? 'video'
                  : 'link'
              }`"
              :value="slotProps.option.type"
              :severity="slotProps.option.severity"
              :pt="{
                value: 'text-[12px]',
              }"
            />
          </template>
        </Dropdown>
      </li>
      <li>
        <label
          class="text-[12px] ml-[12px] md:ml-[7px] mr-1 xl:text-[14px] md:text-[10px]"
        >
          Status
        </label>
        <Dropdown
          v-model="filterInput.status"
          :options="store.state.selectTabview === 0 ? statusPoster : statusEmer"
          optionLabel="status"
          optionValue="status"
          inputClass="text-[13px] lg:text-[16px] text-left"
          :showClear="filterInput.status !== ''"
          class="rounded-lg items-center h-8 w-24 md:w-38 xl:w-32"
        >
          <template #option="slotProps">
            <Tag
              :value="slotProps.option.status"
              :severity="slotProps.option.severity"
              :pt="{
                value: 'text-[12px]',
              }"
            />
          </template>
        </Dropdown>
      </li>
      <li>
        <div>
          <!-- Button for md screens -->
          <li>
            <div class="md:hidden xl:block">
              <Button
                label="Clear"
                @click="store.commit('resetFilter')"
                class="flex justify-end ml-3 right-0 font-bold rounded-[8px] h-8 border-0 bg-red-500 text-right hover:bg-red-600"
              />
            </div>
          </li>
        </div>
      </li>
    </ul>

    <!-- "calendar dashboard"-->
    <ul
      v-if="$route.path === '/' || $route.path === '/search-content'"
      class="justify-between flex-wrap gap-2 lg:gap-5 text-[14px] lg:text-[16px]"
    >
      <div
        class="font-normal text-[16px] flex items-center"
        v-if="!clickSearch"
      >
        <div class="flex gap-2 items-center text-[#575757]">
          <label class="font-semibold w-36 text-left">
            {{ currentViewDate }}
          </label>
          <button
            id="prev"
            class="pi pi-angle-left rounded-full p-1 hover:bg-gray-200"
          ></button>
          <button
            id="next"
            class="pi pi-angle-right rounded-full p-1 hover:bg-gray-200"
          ></button>
        </div>
        <div class="flex items-center gap-4 pl-3">
          <button
            id="today"
            class="border-[1px] rounded-xl hover:bg-gray-200 border-[#878787] text-[#878787] w-[60px] h-[25px] text-[12px] font-normal flex items-center justify-center"
          >
            Today
          </button>
          <button
            id="dayView"
            class="rounded-full p-1 hover:bg-gray-200"
            :class="{ 'bg-gray-300 cursor-not-allowed': !viewType }"
            :disabled="!viewType"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <path
                d="M9.75 17.8751C8.99167 17.8751 8.35069 17.6133 7.82708 17.0897C7.30347 16.5661 7.04167 15.9251 7.04167 15.1667C7.04167 14.4084 7.30347 13.7674 7.82708 13.2438C8.35069 12.7202 8.99167 12.4584 9.75 12.4584C10.5083 12.4584 11.1493 12.7202 11.6729 13.2438C12.1965 13.7674 12.4583 14.4084 12.4583 15.1667C12.4583 15.9251 12.1965 16.5661 11.6729 17.0897C11.1493 17.6133 10.5083 17.8751 9.75 17.8751ZM5.41667 23.8334C4.82083 23.8334 4.31094 23.6214 3.887 23.1975C3.46306 22.7736 3.25072 22.2633 3.25 21.6667V6.50008C3.25 5.90425 3.46233 5.39436 3.887 4.97041C4.31167 4.54647 4.82156 4.33414 5.41667 4.33341H6.5V2.16675H8.66667V4.33341H17.3333V2.16675H19.5V4.33341H20.5833C21.1792 4.33341 21.6894 4.54575 22.1141 4.97041C22.5388 5.39508 22.7507 5.90497 22.75 6.50008V21.6667C22.75 22.2626 22.538 22.7728 22.1141 23.1975C21.6901 23.6222 21.1799 23.8341 20.5833 23.8334H5.41667ZM5.41667 21.6667H20.5833V10.8334H5.41667V21.6667Z"
                :fill="!viewType ? 'black' : '#878787'"
              />
            </svg>
          </button>
          <button
            id="monthView"
            class="rounded-full -ml-1 hover:bg-gray-200"
            :class="{ 'bg-gray-300 cursor-not-allowed': viewType }"
            :disabled="viewType"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="2 -1 32 32"
              fill="none"
            >
              <path
                d="M17.8125 16.6875C17.4878 16.6875 17.2159 16.584 16.9967 16.377C16.7774 16.17 16.6674 15.9141 16.6667 15.6094C16.6667 15.3039 16.7767 15.048 16.9967 14.8417C17.2167 14.6355 17.4886 14.532 17.8125 14.5312C18.1372 14.5312 18.4095 14.6347 18.6295 14.8417C18.8495 15.0487 18.9591 15.3046 18.9583 15.6094C18.9583 15.9148 18.8483 16.1711 18.6283 16.3781C18.4083 16.5851 18.1364 16.6882 17.8125 16.6875ZM13.2292 16.6875C12.9045 16.6875 12.6326 16.584 12.4133 16.377C12.1941 16.17 12.0841 15.9141 12.0833 15.6094C12.0833 15.3039 12.1933 15.048 12.4133 14.8417C12.6333 14.6355 12.9053 14.532 13.2292 14.5312C13.5538 14.5312 13.8261 14.6347 14.0461 14.8417C14.2661 15.0487 14.3758 15.3046 14.375 15.6094C14.375 15.9148 14.265 16.1711 14.045 16.3781C13.825 16.5851 13.5531 16.6882 13.2292 16.6875ZM22.3958 16.6875C22.0712 16.6875 21.7992 16.584 21.58 16.377C21.3608 16.17 21.2508 15.9141 21.25 15.6094C21.25 15.3039 21.36 15.048 21.58 14.8417C21.8 14.6355 22.0719 14.532 22.3958 14.5312C22.7205 14.5312 22.9928 14.6347 23.2128 14.8417C23.4328 15.0487 23.5424 15.3046 23.5417 15.6094C23.5417 15.9148 23.4317 16.1711 23.2117 16.3781C22.9917 16.5851 22.7197 16.6882 22.3958 16.6875ZM17.8125 21C17.4878 21 17.2159 20.8965 16.9967 20.6895C16.7774 20.4825 16.6674 20.2266 16.6667 19.9219C16.6667 19.6164 16.7767 19.3605 16.9967 19.1542C17.2167 18.948 17.4886 18.8445 17.8125 18.8437C18.1372 18.8437 18.4095 18.9472 18.6295 19.1542C18.8495 19.3612 18.9591 19.6171 18.9583 19.9219C18.9583 20.2273 18.8483 20.4836 18.6283 20.6906C18.4083 20.8976 18.1364 21.0007 17.8125 21ZM13.2292 21C12.9045 21 12.6326 20.8965 12.4133 20.6895C12.1941 20.4825 12.0841 20.2266 12.0833 19.9219C12.0833 19.6164 12.1933 19.3605 12.4133 19.1542C12.6333 18.948 12.9053 18.8445 13.2292 18.8437C13.5538 18.8437 13.8261 18.9472 14.0461 19.1542C14.2661 19.3612 14.3758 19.6171 14.375 19.9219C14.375 20.2273 14.265 20.4836 14.045 20.6906C13.825 20.8976 13.5531 21.0007 13.2292 21ZM22.3958 21C22.0712 21 21.7992 20.8965 21.58 20.6895C21.3608 20.4825 21.2508 20.2266 21.25 19.9219C21.25 19.6164 21.36 19.3605 21.58 19.1542C21.8 18.948 22.0719 18.8445 22.3958 18.8437C22.7205 18.8437 22.9928 18.9472 23.2128 19.1542C23.4328 19.3612 23.5424 19.6171 23.5417 19.9219C23.5417 20.2273 23.4317 20.4836 23.2117 20.6906C22.9917 20.8976 22.7197 21.0007 22.3958 21ZM9.79167 25.3125C9.16146 25.3125 8.62215 25.1015 8.17375 24.6796C7.72535 24.2577 7.50076 23.7499 7.5 23.1562V8.0625C7.5 7.46953 7.72458 6.96209 8.17375 6.54019C8.62292 6.11828 9.16222 5.90697 9.79167 5.90625H10.9375V3.75H13.2292V5.90625H22.3958V3.75H24.6875V5.90625H25.8333C26.4635 5.90625 27.0032 6.11756 27.4524 6.54019C27.9016 6.96281 28.1258 7.47025 28.125 8.0625V23.1562C28.125 23.7492 27.9008 24.257 27.4524 24.6796C27.004 25.1023 26.4643 25.3132 25.8333 25.3125H9.79167ZM9.79167 23.1562H25.8333V12.375H9.79167V23.1562Z"
                :fill="viewType ? 'black' : '#878787'"
              />
            </svg>
          </button>
        </div>
      </div>
      <form
        v-if="clickSearch"
        @submit.prevent="search"
        class="flex items-center duration-500"
      >
        <p for="macAddress" class="font-bold text-[12px]">Search</p>
        <InputText
          v-model="searchP"
          autofocus
          class="border text-[13px] font-normal border-[#C6C6C6] ml-4 pl-3 h-4 py-4 w-96 rounded-lg"
          placeholder="Title of Poster (Press Enter to search)"
        ></InputText>
        <button
          class="pi pi-search p-2 text-[#878787] rounded-full hover:bg-[#e4e3e3] ml-3"
          :class="{ 'cursor-not-allowed': !searchP }"
          type="submit"
          :disabled="!searchP"
        ></button>
      </form>
      <div v-if="$route.path === '/'" class="inline-flex gap-3 items-center">
        <button @click="goToSearch">
          <i
            class="pi pi-search text-[#626262] text-xl hover:bg-[#e4e3e3] p-2 rounded-full mr-2"
          ></i>
        </button>
        <Dropdown
          v-model="selectDevice"
          :options="devices"
          optionLabel="deviceName"
          optionValue="MACaddress"
          class="h-8 w-fit rounded-lg border-[#A3A3A3] border-opacity-30 border-[1px] items-center hover:bg-gray-200"
        />
      </div>
    </ul>
  </div>
</template>

<style scoped>
ul {
  display: inline-flex;
  align-items: center;
  width: 100%;
}

li {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

td:first-child {
  padding-right: 30px;
}

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.primaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: #14c6a4;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: #0eb092;
}

.header-popup {
  font-weight: 700;
  font-size: 20px;
  color: #049a7e;
}
</style>

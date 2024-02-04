<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBar",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import router from "@/router";
import { addDevice, getPoster } from "@/services";
import {
  fullMonth,
  customDateFormatter,
  initialFormDevice,
  onUpload,
} from "@/utils/constant";
import { filesize } from "filesize";

const form = reactive({ ...initialFormDevice });

const macNotUse = computed(() => store.state.macNotUse);
const devices = computed(() => store.state.devices);
const searchPosters = computed(() => store.state.searchPosters);
const chooseFile = ref();
const showPopup = ref(false);
const currentViewDate = computed(() => store.state.currentViewDate);
const monthView = ref(true);
const selectedDate = ref(new Date());
const clickSearch = ref(false);
const searchP = ref("");
const toast = useToast();

const selectDevice = computed({
  get() {
    return store.state.selectDevice;
  },
  set(val) {
    store.commit("setSelectDevice", val);
  },
});

watchEffect(() => {
  if (router.currentRoute.value.path === "/searchfile") {
    clickSearch.value = true;
  } else {
    clickSearch.value = false;
    searchP.value = "";
  }
  if (router.currentRoute.value.path === "/") {
    monthView.value = true;
  }
});

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

const resetForm = () => {
  Object.assign(form, initialFormDevice);
};

const goToSearch = () => {
  store.commit("setOpenSidebar", true);
  clickSearch.value = true;
  router.push("/searchfile");
};

const search = async () => {
  store.commit("setSearchPosters", []);
  const res = await getPoster(searchP.value);
  if (res.ok) {
    res.poster.forEach((e: any) => {
      e.createdAt = new Date(e.createdAt);
      e.updatedAt = new Date(e.updatedAt);
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      e.startTime = new Date(e.startTime);
      e.endTime = new Date(e.endTime);
    });
    res.poster.sort((a: any, b: any) => a.startDate - b.startDate);
    store.commit("setSearchPosters", res.poster);
  }
};

const add = async () => {
  const check = form.deviceName?.replace(" ", "").length;
  if (!form.MACaddress || !check) {
    toast.add({
      severity: "error",
      summary: "Invalid",
      detail: "MAC Address or Device Name Invalid",
      life: 3000,
    });
    return;
  }
  if (chooseFile.value) {
    form.location = chooseFile.value;
  }

  const res = await addDevice(form);
  if (res.ok) {
    store.state.devices.push({ ...form });
    showPopup.value = false;
    const temp = macNotUse.value.filter((e) => e !== form.MACaddress);
    store.commit("setMacNotUse", temp);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Add device successfully.",
      life: 3000,
    });
    resetForm();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
};
</script>

<template>
  <Toast />
  <div
    class="h-14 px-6 flex items-center z-10 bg-white border-gray-100 border-b-[2px]"
  >
    <!-- "Management" -->
    <ul
      v-if="$route.path === '/admin'"
      class="flex items-center justify-between w-full"
    >
      <div class="text-lg font-semibold text-gray-800 text-[20px]">
        Management
      </div>
      <div class="ml-auto cursor-pointer" v-if="store.state.adminManage === 2">
        <Button
          class="flex bg-while text-black pr-2 pl-1 py-1.5 gap-2 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold bold-ho bg-white"
          @click="showPopup = true"
        >
          <div
            class="h-6 w-6 rounded-full bg-[#039BE5] flex items-center justify-center ml-1"
          >
            <i class="pi pi-plus text-white"></i>
          </div>
          Add Device
        </Button>
        <Dialog
          v-model:visible="showPopup"
          header="Add Device"
          class="w-[600px] h-auto"
          modal
          close-on-escape
          @after-hide="resetForm()"
        >
          <div class="flex flex-col gap-2">
            <div class="inline-block">
              <label for="deviceName" class="text-primary-50 font-medium"
                >Device Name</label
              >
              <label for="deviceName" class="text-[#FF0000] font-medium"
                >*</label
              >
            </div>
            <InputText
              v-model:model-value="form.deviceName"
              class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
              placeholder="cpe01"
            ></InputText>
          </div>
          <div class="flex flex-col gap-2">
            <div class="inline-block">
              <label for="deviceName" class="text-primary-50 font-medium"
                >MAC Address</label
              >
              <label for="deviceName" class="text-[#FF0000] font-medium"
                >*</label
              >
            </div>
            <Dropdown
              class="mb-3"
              v-model:model-value="form.MACaddress"
              :options="macNotUse"
              :placeholder="
                macNotUse.length
                  ? 'Select a MAC Address'
                  : 'All Device has already been added'
              "
              :disabled="!macNotUse.length"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="macAddress" class="text-primary-50 font-medium"
              >Room</label
            >
            <InputText
              v-model:model-value="form.room"
              class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
              placeholder="(Optional)"
            ></InputText>
          </div>
          <div class="flex flex-col gap-1">
            <label for="macAddress" class="text-primary-50 font-medium"
              >Location Description</label
            >
            <InputText
              v-model:model-value="form.description"
              class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
              placeholder="(Optional)"
            ></InputText>
          </div>
          <div class="flex flex-col gap-1">
            <label for="macAddress" class="text-primary-50 font-medium"
              >Location Photo</label
            >
            <FileUpload
              accept="image/*"
              customUpload
              :show-upload-button="false"
              :show-cancel-button="false"
              :multiple="false"
              @select="
                async (e) => {
                  if (e.files[0]) chooseFile = await onUpload(e);
                  else errorSelectFile();
                }
              "
            >
              <template #header="{ chooseCallback, clearCallback }">
                <div class="flex items-center">
                  <Button
                    @click="
                      clearCallback();
                      chooseFile = null;
                      chooseCallback();
                    "
                    icon="pi pi-plus"
                    label="Choose File"
                    rounded
                    outlined
                  ></Button>
                </div>
              </template>
              <template #content="{ files, removeFileCallback }">
                <div
                  v-if="files[0] && chooseFile"
                  class="flex justify-between items-center w-full"
                >
                  <img
                    :alt="files[0].name"
                    :src="chooseFile"
                    class="w-2/4 h-2/4"
                  />
                  <div class="w-fit">{{ filesize(files[0].size) }}</div>
                  <Button
                    icon="pi pi-times"
                    @click="removeFileCallback(0)"
                    outlined
                    rounded
                    severity="danger"
                  />
                </div>
                <div v-else></div>
              </template>
              <template #empty>
                <div class="flex flex-col text-center items-center">
                  <i
                    class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
                  />
                  <p class="mt-4 mb-0">
                    Drag and drop files to here to upload.
                  </p>
                </div>
              </template>
            </FileUpload>
          </div>
          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Cancel"
              text
              @click="
                showPopup = false;
                resetForm();
              "
              class="flex-1 border-1 border-white-alpha-30 bold-ho rounded-lg py-2 mt-2"
            ></Button>
            <Button
              label="Add"
              text
              class="flex-1 border-1 font-semibold border-white-alpha-30 bold-ho-add rounded-lg py-2 mt-2"
              :class="`${!macNotUse.length ? 'cursor-not-allowed' : ''}`"
              @click="add"
              :disabled="!macNotUse.length"
            ></Button>
          </div>
        </Dialog>
      </div>
    </ul>

    <!-- "Emergency" -->
    <ul v-if="$route.path === '/emergency'" class="flex justify-between">
      <li class="text-lg font-semibold text-[#FF0000] text-[20px]">
        Emergency Activation
      </li>
    </ul>

    <!-- "Device" -->
    <ul v-if="$route.path === '/deviceManage'" class="flex justify-between">
      <li class="text-lg font-semibold text-black text-[20px]">Device</li>
    </ul>

    <!-- "File Manage" -->
    <ul v-if="$route.path === '/file'" class="flex items-center">
      <div
        class="text-lg font-normal text-black items-center pt-3 text-[13px] flex-col"
      >
        <label for="macAddress" class="font-medium">Title </label>
        <InputText
          id="email"
          class="border text-[13px] font-normal border-[#C6C6C6] ml-1 mr-4 pl-3 h-7 py-4 w-40 rounded-lg"
          placeholder="Search Poster Title"
        ></InputText>
        <label for="macAddress" class="font-medium">Uploader </label>
        <InputText
          id="email"
          class="border text-[13px] font-normal border-[#C6C6C6] ml-1 mr-4 pl-3 h-7 py-4 w-40 rounded-lg"
          placeholder="English firstname"
        ></InputText>
        <div class="inline-flex">
          <label for="macAddress" class="font-medium">Upload Date </label>
          <VueDatePicker
            v-model="selectedDate"
            class="custom-date-picker ml-3 pb-10 h-10"
            :enable-time-picker="false"
            :format="customDateFormatter(selectedDate)"
          ></VueDatePicker>
        </div>
      </div>
    </ul>

    <!-- "calendar dashboard"-->
    <ul
      v-if="$route.path === '/' || $route.path === '/searchfile'"
      class="flex items-center justify-between w-full"
    >
      <div
        class="text-lg font-normal text-[13px] flex items-center"
        v-if="!clickSearch"
      >
        <div class="flex gap-2 items-center text-[#777]">
          <label class="font-semibold w-52 text-[18px]">
            {{ currentViewDate }}
          </label>
          <button
            id="prev"
            class="pi pi-angle-left rounded-full p-1 hover:bg-gray-300"
          ></button>
          <button
            id="next"
            class="pi pi-angle-right rounded-full p-1 hover:bg-gray-300"
          ></button>
        </div>
        <div class="flex items-center gap-4 pl-3">
          <button
            id="today"
            class="border-[1px] rounded-xl hover:bg-gray-300 border-[#878787] text-[#878787] w-[60px] h-[25px] text-[14px] font-normal flex items-center justify-center"
          >
            Today
          </button>
          <button
            id="dayView"
            class="rounded-full p-1 hover:bg-gray-300"
            :class="{ 'bg-gray-200 cursor-not-allowed': !monthView }"
            :disabled="!monthView"
            @click="monthView = false"
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
                :fill="!monthView ? 'black' : '#878787'"
              />
            </svg>
          </button>
          <button
            id="monthView"
            class="rounded-full -ml-1 hover:bg-gray-300"
            :class="{ 'bg-gray-200 cursor-not-allowed': monthView }"
            :disabled="monthView"
            @click="monthView = true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M17.8125 16.6875C17.4878 16.6875 17.2159 16.584 16.9967 16.377C16.7774 16.17 16.6674 15.9141 16.6667 15.6094C16.6667 15.3039 16.7767 15.048 16.9967 14.8417C17.2167 14.6355 17.4886 14.532 17.8125 14.5312C18.1372 14.5312 18.4095 14.6347 18.6295 14.8417C18.8495 15.0487 18.9591 15.3046 18.9583 15.6094C18.9583 15.9148 18.8483 16.1711 18.6283 16.3781C18.4083 16.5851 18.1364 16.6882 17.8125 16.6875ZM13.2292 16.6875C12.9045 16.6875 12.6326 16.584 12.4133 16.377C12.1941 16.17 12.0841 15.9141 12.0833 15.6094C12.0833 15.3039 12.1933 15.048 12.4133 14.8417C12.6333 14.6355 12.9053 14.532 13.2292 14.5312C13.5538 14.5312 13.8261 14.6347 14.0461 14.8417C14.2661 15.0487 14.3758 15.3046 14.375 15.6094C14.375 15.9148 14.265 16.1711 14.045 16.3781C13.825 16.5851 13.5531 16.6882 13.2292 16.6875ZM22.3958 16.6875C22.0712 16.6875 21.7992 16.584 21.58 16.377C21.3608 16.17 21.2508 15.9141 21.25 15.6094C21.25 15.3039 21.36 15.048 21.58 14.8417C21.8 14.6355 22.0719 14.532 22.3958 14.5312C22.7205 14.5312 22.9928 14.6347 23.2128 14.8417C23.4328 15.0487 23.5424 15.3046 23.5417 15.6094C23.5417 15.9148 23.4317 16.1711 23.2117 16.3781C22.9917 16.5851 22.7197 16.6882 22.3958 16.6875ZM17.8125 21C17.4878 21 17.2159 20.8965 16.9967 20.6895C16.7774 20.4825 16.6674 20.2266 16.6667 19.9219C16.6667 19.6164 16.7767 19.3605 16.9967 19.1542C17.2167 18.948 17.4886 18.8445 17.8125 18.8437C18.1372 18.8437 18.4095 18.9472 18.6295 19.1542C18.8495 19.3612 18.9591 19.6171 18.9583 19.9219C18.9583 20.2273 18.8483 20.4836 18.6283 20.6906C18.4083 20.8976 18.1364 21.0007 17.8125 21ZM13.2292 21C12.9045 21 12.6326 20.8965 12.4133 20.6895C12.1941 20.4825 12.0841 20.2266 12.0833 19.9219C12.0833 19.6164 12.1933 19.3605 12.4133 19.1542C12.6333 18.948 12.9053 18.8445 13.2292 18.8437C13.5538 18.8437 13.8261 18.9472 14.0461 19.1542C14.2661 19.3612 14.3758 19.6171 14.375 19.9219C14.375 20.2273 14.265 20.4836 14.045 20.6906C13.825 20.8976 13.5531 21.0007 13.2292 21ZM22.3958 21C22.0712 21 21.7992 20.8965 21.58 20.6895C21.3608 20.4825 21.2508 20.2266 21.25 19.9219C21.25 19.6164 21.36 19.3605 21.58 19.1542C21.8 18.948 22.0719 18.8445 22.3958 18.8437C22.7205 18.8437 22.9928 18.9472 23.2128 19.1542C23.4328 19.3612 23.5424 19.6171 23.5417 19.9219C23.5417 20.2273 23.4317 20.4836 23.2117 20.6906C22.9917 20.8976 22.7197 21.0007 22.3958 21ZM9.79167 25.3125C9.16146 25.3125 8.62215 25.1015 8.17375 24.6796C7.72535 24.2577 7.50076 23.7499 7.5 23.1562V8.0625C7.5 7.46953 7.72458 6.96209 8.17375 6.54019C8.62292 6.11828 9.16222 5.90697 9.79167 5.90625H10.9375V3.75H13.2292V5.90625H22.3958V3.75H24.6875V5.90625H25.8333C26.4635 5.90625 27.0032 6.11756 27.4524 6.54019C27.9016 6.96281 28.1258 7.47025 28.125 8.0625V23.1562C28.125 23.7492 27.9008 24.257 27.4524 24.6796C27.004 25.1023 26.4643 25.3132 25.8333 25.3125H9.79167ZM9.79167 23.1562H25.8333V12.375H9.79167V23.1562Z"
                :fill="monthView ? 'black' : '#878787'"
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
        <p for="macAddress" class="font-bold">Search</p>
        <InputText
          v-model="searchP"
          autofocus
          class="border text-[13px] font-normal border-[#C6C6C6] ml-4 pl-3 h-4 py-4 w-60 rounded-lg"
          placeholder="Search Poster"
        ></InputText>
        <button
          class="pi pi-search p-2 text-[#878787] rounded-full hover:bg-[#e4e3e3] ml-3"
          :class="{ 'cursor-not-allowed': !searchP }"
          type="submit"
          :disabled="!searchP"
        ></button>
      </form>
      <div v-if="$route.path === '/'" class="flex gap-3 items-center">
        <button @click="goToSearch">
          <i
            class="pi pi-search text-[#878787] hover:bg-[#e4e3e3] p-2 rounded-full mr-2"
          ></i>
        </button>
        <Dropdown
          v-model="selectDevice"
          :options="devices"
          optionLabel="deviceName"
          optionValue="MACaddress"
          class="w-fit h-10 rounded-lg border-[#A3A3A3] border-opacity-30 border-2 items-center"
        />
        <Button
          class="flex bg-while p-2 bg-white w-38 py-1.5 gap-2 items-center rounded-lg border-[#A3A3A3] text-black border-opacity-30 border-2 font-semibold bold-ho"
          @click="router.push('/uploadfile')"
        >
          <div
            class="h-6 w-6 rounded-full bg-[#039BE5] flex items-center justify-center"
          >
            <i class="pi pi-plus text-white"></i>
          </div>
          Upload File
        </Button>
      </div>
    </ul>

    <!-- "Upload File" -->
    <ul v-if="$route.path === '/uploadfile'" class="flex justify-between">
      <li class="text-lg font-semibold text-black text-[20px]">Upload File</li>
    </ul>
  </div>
</template>

<style scoped>
/* Adjust the width as needed */
.custom-date-picker {
  width: 200px; /* Set the desired width */
  height: 1.75rem;
}

.bold-ho:hover {
  font-weight: 600;
  background-color: #e2e2e2;
}

.bold-ho-add:hover {
  font-weight: 600;
  text-decoration: underline;
  background-color: #a9ddf8;
}
</style>

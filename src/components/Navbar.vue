<script lang="ts">
import store from "@/store";
import { ref } from "vue";
import Dialog from "primevue/dialog";
import "primeicons/primeicons.css";

export default {
  name: "NavBar",
  components: {},
  data() {
    return {
      showPopup: false,
      date: null,
    };
  },
  computed: {
    click() {
      return store.state.adminManage;
    },
  },
  methods: {
    addDevice() {
      console.log();
    },
    customDateFormatter(date: Date) {
      if (!date) return "";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
  },
};
</script>

<template>
  <div
    class="bg-[#F6F6F6] border-b border-[#c7bbbb] h-14 px-6 flex items-center"
  >
    <!-- "Management" -->
    <ul v-if="$route.path === '/admin'" class="flex justify-between">
      <li class="text-lg font-semibold text-gray-800 text-[20px]">
        Management
      </li>
      <div class="ml-auto pt-2 cursor-pointer" v-if="click === 1">
        <button
          class="flex bg-while pr-2 pl-1 py-1 gap-2 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold bold-ho"
          @click="showPopup = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="28 28"
            fill="none"
          >
            <g filter="url(#filter0_d_701_79)">
              <ellipse
                cx="16.5067"
                cy="14.5"
                rx="11.5913"
                ry="11.5"
                fill="#039BE5"
              />
              <path
                d="M17.523 8.84783C17.523 8.62297 17.4329 8.40732 17.2727 8.24832C17.1124 8.08932 16.8951 8 16.6684 8C16.4418 8 16.2244 8.08932 16.0641 8.24832C15.9039 8.40732 15.8139 8.62297 15.8139 8.84783V13.6522H10.9714C10.7447 13.6522 10.5274 13.7415 10.3671 13.9005C10.2069 14.0595 10.1168 14.2751 10.1168 14.5C10.1168 14.7249 10.2069 14.9405 10.3671 15.0995C10.5274 15.2585 10.7447 15.3478 10.9714 15.3478H15.8139V20.1522C15.8139 20.377 15.9039 20.5927 16.0641 20.7517C16.2244 20.9107 16.4418 21 16.6684 21C16.8951 21 17.1124 20.9107 17.2727 20.7517C17.4329 20.5927 17.523 20.377 17.523 20.1522V15.3478H22.3654C22.5921 15.3478 22.8094 15.2585 22.9697 15.0995C23.13 14.9405 23.22 14.7249 23.22 14.5C23.22 14.2751 23.13 14.0595 22.9697 13.9005C22.8094 13.7415 22.5921 13.6522 22.3654 13.6522H17.523V8.84783Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_701_79"
                x="0.915405"
                y="0"
                width="31.1825"
                height="31"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend mode="normal" in2="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" result="shape" />
              </filter>
            </defs>
          </svg>
          Add Device
        </button>
        <Dialog
          v-model:visible="showPopup"
          :close-on-escape="true"
          close-icon="false"
          class="w-auto h-auto bg-white pb-1 rounded-lg"
          :pt="{
            mask: {
              style:
                'backdrop-filter: blur(1px); background-color: rgba(0, 0, 0, 0.6);', // Grey color with 20% opacity
            },
          }"
        >
          <div
            className="bg-[#F6F6F6] flex border-b-2 w-full rounded-t-lg"
            style="border-color: rgba(0, 0, 0, 0.1)"
          >
            <p className="text-black font-semibold text-[20px] pl-5 pb-3 pt-3">
              Add Device
            </p>
          </div>
          <div
            class="flex flex-col px-8 py-5 gap-4"
            style="border-radius: 12px"
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
                id="deviceName"
                class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg"
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
              <InputText
                id="macAddress"
                class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg"
                placeholder="00:00:00:00:00:00"
              ></InputText>
            </div>
            <div class="flex flex-col gap-2">
              <label for="macAddress" class="text-primary-50 font-medium"
                >Room</label
              >
              <InputText
                id="room"
                class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg"
                placeholder="(Optional)"
                a
              ></InputText>
            </div>
            <div class="flex flex-col gap-1">
              <label for="macAddress" class="text-primary-50 font-medium"
                >Description</label
              >
              <InputText
                id="description"
                class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg"
                placeholder="(Optional)"
              ></InputText>
            </div>
            <div class="flex flex-row gap-4 pt-3">
              <Button
                label="Cancel"
                text
                @click="showPopup = false"
                class="flex-1 border-1 border-white-alpha-30 bold-ho rounded-lg py-2"
              ></Button>
              <Button
                label="Add"
                text
                class="flex-1 border-1 border-white-alpha-30 bold-ho-add rounded-lg py-2"
                @click="
                  () => {
                    addDevice();
                    showPopup = false;
                  }
                "
              ></Button>
            </div>
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
            v-model="date"
            class="custom-date-picker ml-3 pb-10 h-10"
            :enable-time-picker="false"
            :formatter="customDateFormatter"
          ></VueDatePicker>
        </div>
      </div>
    </ul>

    <!-- "calendar dashboard"-->
    <ul
      v-if="$route.path === '/'"
      class="flex items-center justify-between w-full"
    >
      <div class="text-lg font-normal text-[13px] flex items-center">
        <div class="flex gap-2 items-center text-[#777]">
          <label class="font-normal; text-[18px]">November 2023 </label>
          <i class="pi pi-angle-left"></i>
          <i class="pi pi-angle-right"></i>
        </div>

        <div class="flex items-center gap-4 pl-2">
          <button
            class="border-[1px] rounded-xl border-[#878787] text-[#878787] w-[60px] h-[25px] text-[14px] font-normal flex items-center justify-center"
          >
            Today
          </button>
          <!-- หาใน primevue แล้วรู้สึกดูอยากกว่าของ figma -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
          >
            <path
              d="M9.75 17.8751C8.99167 17.8751 8.35069 17.6133 7.82708 17.0897C7.30347 16.5661 7.04167 15.9251 7.04167 15.1667C7.04167 14.4084 7.30347 13.7674 7.82708 13.2438C8.35069 12.7202 8.99167 12.4584 9.75 12.4584C10.5083 12.4584 11.1493 12.7202 11.6729 13.2438C12.1965 13.7674 12.4583 14.4084 12.4583 15.1667C12.4583 15.9251 12.1965 16.5661 11.6729 17.0897C11.1493 17.6133 10.5083 17.8751 9.75 17.8751ZM5.41667 23.8334C4.82083 23.8334 4.31094 23.6214 3.887 23.1975C3.46306 22.7736 3.25072 22.2633 3.25 21.6667V6.50008C3.25 5.90425 3.46233 5.39436 3.887 4.97041C4.31167 4.54647 4.82156 4.33414 5.41667 4.33341H6.5V2.16675H8.66667V4.33341H17.3333V2.16675H19.5V4.33341H20.5833C21.1792 4.33341 21.6894 4.54575 22.1141 4.97041C22.5388 5.39508 22.7507 5.90497 22.75 6.50008V21.6667C22.75 22.2626 22.538 22.7728 22.1141 23.1975C21.6901 23.6222 21.1799 23.8341 20.5833 23.8334H5.41667ZM5.41667 21.6667H20.5833V10.8334H5.41667V21.6667Z"
              fill="#878787"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M17.8125 16.6875C17.4878 16.6875 17.2159 16.584 16.9967 16.377C16.7774 16.17 16.6674 15.9141 16.6667 15.6094C16.6667 15.3039 16.7767 15.048 16.9967 14.8417C17.2167 14.6355 17.4886 14.532 17.8125 14.5312C18.1372 14.5312 18.4095 14.6347 18.6295 14.8417C18.8495 15.0487 18.9591 15.3046 18.9583 15.6094C18.9583 15.9148 18.8483 16.1711 18.6283 16.3781C18.4083 16.5851 18.1364 16.6882 17.8125 16.6875ZM13.2292 16.6875C12.9045 16.6875 12.6326 16.584 12.4133 16.377C12.1941 16.17 12.0841 15.9141 12.0833 15.6094C12.0833 15.3039 12.1933 15.048 12.4133 14.8417C12.6333 14.6355 12.9053 14.532 13.2292 14.5312C13.5538 14.5312 13.8261 14.6347 14.0461 14.8417C14.2661 15.0487 14.3758 15.3046 14.375 15.6094C14.375 15.9148 14.265 16.1711 14.045 16.3781C13.825 16.5851 13.5531 16.6882 13.2292 16.6875ZM22.3958 16.6875C22.0712 16.6875 21.7992 16.584 21.58 16.377C21.3608 16.17 21.2508 15.9141 21.25 15.6094C21.25 15.3039 21.36 15.048 21.58 14.8417C21.8 14.6355 22.0719 14.532 22.3958 14.5312C22.7205 14.5312 22.9928 14.6347 23.2128 14.8417C23.4328 15.0487 23.5424 15.3046 23.5417 15.6094C23.5417 15.9148 23.4317 16.1711 23.2117 16.3781C22.9917 16.5851 22.7197 16.6882 22.3958 16.6875ZM17.8125 21C17.4878 21 17.2159 20.8965 16.9967 20.6895C16.7774 20.4825 16.6674 20.2266 16.6667 19.9219C16.6667 19.6164 16.7767 19.3605 16.9967 19.1542C17.2167 18.948 17.4886 18.8445 17.8125 18.8437C18.1372 18.8437 18.4095 18.9472 18.6295 19.1542C18.8495 19.3612 18.9591 19.6171 18.9583 19.9219C18.9583 20.2273 18.8483 20.4836 18.6283 20.6906C18.4083 20.8976 18.1364 21.0007 17.8125 21ZM13.2292 21C12.9045 21 12.6326 20.8965 12.4133 20.6895C12.1941 20.4825 12.0841 20.2266 12.0833 19.9219C12.0833 19.6164 12.1933 19.3605 12.4133 19.1542C12.6333 18.948 12.9053 18.8445 13.2292 18.8437C13.5538 18.8437 13.8261 18.9472 14.0461 19.1542C14.2661 19.3612 14.3758 19.6171 14.375 19.9219C14.375 20.2273 14.265 20.4836 14.045 20.6906C13.825 20.8976 13.5531 21.0007 13.2292 21ZM22.3958 21C22.0712 21 21.7992 20.8965 21.58 20.6895C21.3608 20.4825 21.2508 20.2266 21.25 19.9219C21.25 19.6164 21.36 19.3605 21.58 19.1542C21.8 18.948 22.0719 18.8445 22.3958 18.8437C22.7205 18.8437 22.9928 18.9472 23.2128 19.1542C23.4328 19.3612 23.5424 19.6171 23.5417 19.9219C23.5417 20.2273 23.4317 20.4836 23.2117 20.6906C22.9917 20.8976 22.7197 21.0007 22.3958 21ZM9.79167 25.3125C9.16146 25.3125 8.62215 25.1015 8.17375 24.6796C7.72535 24.2577 7.50076 23.7499 7.5 23.1562V8.0625C7.5 7.46953 7.72458 6.96209 8.17375 6.54019C8.62292 6.11828 9.16222 5.90697 9.79167 5.90625H10.9375V3.75H13.2292V5.90625H22.3958V3.75H24.6875V5.90625H25.8333C26.4635 5.90625 27.0032 6.11756 27.4524 6.54019C27.9016 6.96281 28.1258 7.47025 28.125 8.0625V23.1562C28.125 23.7492 27.9008 24.257 27.4524 24.6796C27.004 25.1023 26.4643 25.3132 25.8333 25.3125H9.79167ZM9.79167 23.1562H25.8333V12.375H9.79167V23.1562Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      <router-link to="/searchfile"
        ><i class="pi pi-search text-[#878787]"></i
      ></router-link>
    </ul>

     <!-- "search file"-->
    <ul
      v-if="$route.path === '/searchfile'"
      class="flex items-center w-full"
    >
    <div class="flex gap-2 items-center">
        <label for="macAddress" class="font-medium">Search</label>
        <div>
          <InputText
          id="email"
          class="border text-[13px] font-normal border-[#C6C6C6] ml-1 mr-4 pl-3 h-7 py-4 w-60  rounded-l-lg rounded-r-none"
          placeholder="Search File"
        ></InputText>
        <div class="w-40 h-full bg-[#CCCCCC]">
           
        </div>
        </div>
   
      </div>

    </ul>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the transparency as needed */
  z-index: 999; /* Make sure it's above other elements */
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Make sure it's above the overlay */
}

/* Adjust the width as needed */
.custom-date-picker {
  width: 200px; /* Set the desired width */
  height: 1.75rem;
}

.bold-ho:hover {
  font-weight: 900;
  text-decoration: underline;
  background-color: #e2e2e2;
}

.bold-ho-add:hover {
  font-weight: 900;
  text-decoration: underline;
  background-color: #a9ddf8;
}
</style>

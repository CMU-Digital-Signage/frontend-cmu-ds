<script lang="ts">
import store from "@/store";
import { ref } from "vue";
import Dialog from "primevue/dialog";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "NavBar",
  components: { VueDatePicker },
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
  <div class="bg-[#F6F6F6] border-b border-[#c7bbbb] h-14 px-6 items-center">
    <!-- "Management" -->
    <ul v-if="$route.path === '/admin'" class="flex justify-between">
      <li class="text-lg font-semibold text-gray-800 pt-3.5 text-[20px]">
        Management
      </li>
      <div class="ml-auto pt-2 cursor-pointer" v-if="!click">
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
      <li class="text-lg font-semibold text-[#FF0000] pt-3.5 text-[20px]">
        Emergency Activation
      </li>
    </ul>

    <!-- "Device" -->
    <ul v-if="$route.path === '/deviceManage'" class="flex justify-between">
      <li class="text-lg font-semibold text-black pt-3.5 text-[20px]">
        Device
      </li>
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

<template>
  <div class="bg-[#F6F6F6] border-b border-[#c7bbbb] h-14 px-6">
    <!-- "Management" -->
    <ul
      v-if="$route.path === '/admin'"
      class="flex justify-between"
    >
      <li class="text-lg font-semibold text-gray-800 pt-3.5">Management</li>
      <li class="ml-auto pt-2" v-if="!click">
        <button
          class="flex bg-while pr-2 pl-1 py-1 gap-2 items-center rounded-lg border-[#A3A3A3] border-opacity-30 border-2 font-semibold"
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
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import store from "@/store";

export default {
  name: "NavBar",
  computed: {
    click() {
      return store.state.adminManage;
    },
  },
};
</script>

<style></style>

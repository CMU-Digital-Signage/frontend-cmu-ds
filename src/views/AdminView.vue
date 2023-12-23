<template>
  <!-- Rectangle -->
  <div class="rectangle">
    <ul class="flex gap-8 pt-5 text-[18px] ">
      <li
        class="bold-ho cursor-pointer"
        :class="{ 'activer-link': click }"
        @click="admin"
      >
        Admin
      </li>
      <li
        class="bold-ho cursor-pointer"
        :class="{ 'activer-link': !click }"
        @click="device"
      >
        Device
      </li>
    </ul>
    <div class="border-t-[1.5px] w-12/12 border-[#C4C4C4] mt-[-1px] "></div>
    <Admin v-if="click"> </Admin>
    <Device v-if="!click"></Device>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "@/router";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue"

export default defineComponent({
  name: "AdminView",
  components: { Admin, Device },
  computed: {
    click() {
      return store.state.adminManage
    }
  },
  methods: {
    admin() {
      store.commit("setAdminManage")
    },
    device() {
      store.commit("setDeviceManage")
    },
  }
});
</script>

<style scoped>
/* Add styles for the rectangle */
.rectangle {
  background-color: #b18b8b00; /* Adjust the background color as needed */
  /* height: calc(100vh - 3.5rem); */
  padding-right: 1.5rem;
  padding-left: 1.5rem;
}

.bold-ho:hover {
  font-weight: 600;
}

.activer-link {
  border-bottom: 4px solid #282828;
  font-weight: 900;
  border-radius: -2-px;
}

.activer-link:hover {
  color: #282828;
  background-color: #f0f0f0; /* Optional: change background color on hover */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional: add box shadow on hover */
}



</style>

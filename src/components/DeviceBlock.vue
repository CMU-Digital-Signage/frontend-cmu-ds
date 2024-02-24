<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import LoginView from "@/views/LoginView.vue";

export default defineComponent({
  name: "DeviceBlock",
});
</script>
<script setup lang="ts">
import { computed, toRefs, defineProps } from "vue";
import { Device } from "@/types";

const props = defineProps<{ device: Device }>();
const { device } = toRefs(props);
const devices = computed(() => store.state.devices);

// :disabled="device.status == false"
// onupdated
</script>

<template>
  <div style="position: relative">
    <div>
      <Button
        @click="
          $router.push(`/preview/${device.MACaddress}`);
          store.state.openSidebar = true;
        "
        class="button1 size-fit bg-[#f3f3f3] hover:bg-gray-300"
      >
        <i
          :class="[
            device.status ? 'text-[#62ccca]' : 'text-gray-400',
            'pi pi-desktop',
            'text-[70px]',
          ]"
        ></i>
        <div class="mr-5">
          <p
            :class="[
              device.status ? 'text-black' : 'text-gray-400',
              'font-bold',
              'text-[16px]',
            ]"
          >
            {{ device.deviceName }}
          </p>
          <p :class="[device.status ? 'text-black' : 'text-gray-400']">
            Room: {{ device.room }}
          </p>
          <p class="text-gray-400" v-if="device.status == false">Off</p>
          <p class="text-[#62ccca]" v-if="device.status == true">On</p>
        </div>
      </Button>
    </div>
    <Button
      class="w-8 h-8 roundbtn"
      icon="pi pi-power-off"
      rounded
      :class="{ 'bg-gray-400': device.status === false }"
      @click="device.status == true"
    ></Button>
  </div>
</template>

<style scope>
.button1 {
  margin-top: 3px;
  margin-bottom: 10px;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 25px;
  text-align: left;
  border-color: #bbbaba;
  padding: 20px 35px;
}

.roundbtn {
  background-color: #62ccca;
  border: none;
  position: absolute;
  bottom: 15px;
  right: 8px;
}
</style>

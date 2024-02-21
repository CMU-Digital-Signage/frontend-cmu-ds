<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";

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
</script>

<template>
  <div style="position: relative">
    <Button
      @click="
        $router.push(`/preview/${device.MACaddress}`);
        store.state.openSidebar = true;
      "
      class="button1 size-fit bg-[#f3f3f3] hover:bg-gray-300"
    >
      <i class="pi pi-desktop text-[70px] text-[#62ccca]"></i>
      <div class="mr-5">
        <p class="font-bold text-[16px] text-black">
          {{ device.deviceName }}
        </p>
        <p class="text-[] text-black">Room: {{ device.room }}</p>
        <p class="text-[#62ccca]">On</p>
      </div>
      <Button class="w-8 h-8 roundbtn" icon="pi pi-power-off" rounded />
    </Button>
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
  bottom: 8px;
  right: 8px;
}
</style>

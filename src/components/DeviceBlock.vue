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
  <Button class="button1 size-fit bg-[#f3f3f3] hover:bg-gray-300">
    <i class="pi pi-desktop text-[70px] text-[#62ccca]"></i>
    <div>
      <p class="font-bold text-[16px] text-black">
        {{ device.deviceName }}
      </p>
      <p class="text-[] text-black">Room: {{ device.room }}</p>
      <p class="text-[#62ccca]">On</p>
    </div>
  </Button>
</template>

<style scope>
.button1 {
  margin-top: 3px;
  margin-bottom: 10px;
  border-radius: 8px;
  column-count: 2;
  column-gap: 20px;
  text-align: left;
  border-color: #bbbaba;
  padding: 15px 30px;
  margin-right: 20px;
}
</style>

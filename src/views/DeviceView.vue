<script setup lang="ts">
import store from "@/store";
import DeviceBlock from "@/components/DeviceBlock.vue";
import { computed, onMounted, ref, watch } from "vue";

const devices = computed(() => store.state.devices);
const floors = ref<string[] | any>([]);
onMounted(() => {
  devices.value?.forEach((e) => {
    if (!floors.value?.includes(e.room?.charAt(0))) {
      floors.value.push(e.room?.charAt(0));
    }
  });
});
</script>

<template>
  <div class="rectangle">
    <div
      v-for="(floor, index) in floors"
      :key="index"
      class="text-left mt-5 ml-5"
    >
      <p class="font-bold text-[18px] mt-3">{{ floor }}th Floor</p>
      <p class="text-[#3671BF] text-[15px]">
        {{ devices.filter((e) => e.room?.startsWith(floor || "")).length }}
        Devices
      </p>
      <div
        v-for="(device, innerIndex) in devices"
        :key="innerIndex"
        class="flex flex-wrap gap-10"
      >
        <DeviceBlock
          v-if="device.room?.startsWith(floor || '')"
          :device="device"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  flex: 1 1;
  padding-inline: 1.5rem;
  margin-bottom: 3.5rem;
  overflow-y: auto;
}
.column {
  margin-top: 1%;
  column-count: 4;
  column-gap: 0.5px;
  margin-right: 13%;
}
</style>

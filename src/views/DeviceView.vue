<script setup lang="ts">
import store from "@/store";
import DeviceBlock from "@/components/DeviceBlock.vue";
import { computed, onMounted, ref, watch } from "vue";

const devices = computed(() => store.state.devices);
const loading = ref(false);
const floors = ref<string[] | any>([]);
onMounted(() => {
  if (!devices.value.length) loading.value = true;
  else {
    devices.value.forEach((e) => {
      if (!floors.value?.includes(e.room?.charAt(0))) {
        floors.value.push(e.room?.charAt(0));
      }
    });
  }
});
watch(devices, () => {
  if (devices.value.length) {
    devices.value.forEach((e) => {
      if (!floors.value?.includes(e.room?.charAt(0))) {
        floors.value.push(e.room?.charAt(0));
      }
    });
    loading.value = false;
  }
});
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-[0.75rem]"
    ></Skeleton>
    <div v-else v-for="(floor, index) in floors" :key="index" class="text-left">
      <p
        class="font-semibold text-[16px] px-4 py-3 border-b-2 border-[#dee2e6]"
      >
        {{ floor }}th Floor
      </p>
      <p class="text-[#3671BF] text-[16px] p-4">
        {{ devices.filter((e) => e.room?.startsWith(floor || "")).length }}
        Devices
      </p>
      <div class="inline-flex flex-wrap gap-4 mx-4">
        <DeviceBlock
          v-for="(device, innerIndex) in devices"
          :key="innerIndex"
          v-show="device.room?.startsWith(floor || '')"
          :device="device"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  width: 100%;
  height: 100%;
  padding-inline: 0.75rem;
  gap: 1rem;
  overflow-y: auto;
}
.column {
  margin-top: 1%;
  column-count: 4;
  column-gap: 0.5px;
  margin-right: 13%;
}
</style>

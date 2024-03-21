<script setup lang="ts">
import store from "@/store";
import DeviceBlock from "@/components/DeviceBlock.vue";
import { computed, onMounted, ref, watch } from "vue";

const devices = computed(() => store.state.devices);
const loading = ref(false);
const floors = ref<string[] | any>([]);
onMounted(() => {
  if (!devices.value) loading.value = true;
  else {
    devices.value.forEach((e) => {
      if (!floors.value?.includes(e.room?.charAt(0))) {
        floors.value.push(e.room?.charAt(0));
      }
    });
  }
});
watch(devices, () => {
  if (devices.value) {
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
    <div
      v-else-if="devices"
      v-for="(floor, index) in floors"
      :key="index"
      class="text-left pb-7 first:border-none border-t-2 border-[#dee2e6]"
    >
      <p class="font-semibold text-[16px] px-4 pt-4">{{ floor }}th Floor</p>
      <p class="text-[#3671BF] text-[16px] px-4 pb-4">
        {{ devices.filter((e) => e.room?.startsWith(floor || "")).length }}
        {{
          devices.filter((e) => e.room?.startsWith(floor || "")).length > 1
            ? "Devices"
            : "Device"
        }}
      </p>
      <p></p>
      <div class="inline-flex flex-wrap gap-4 mx-5">
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
  width: 98%;
  height: 100%;
  margin-left: 1rem;
  margin-bottom: 2rem;
  padding-inline: 1rem;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 0.2rem;
  padding-top: 0.25rem;
  padding-bottom: 0.15rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

}
.column {
  margin-top: 1%;
  column-count: 4;
  column-gap: 0.5px;
  margin-right: 13%;
}
</style>

<script setup lang="ts">
import store from "@/store";
import DeviceBlock from "@/components/DeviceBlock.vue";
import { computed, onMounted, ref, watch } from "vue";

const devices = computed(() =>
  store.state.devices?.sort((a, b) => {
    if (a.room! < b.room!) return -1;
    else if (a.room! > b.room!) return 1;
    else return 1;
  })
);
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
      class="text-left pb-7 first:border-none border-t-[1px] border-[#dddddd]"
    >
      <p class="font-semibold text-[14px] px-4 pt-4">{{ floor }}th Floor</p>
      <p class="text-[#3671BF] text-[12px] px-4 pb-4">
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
.column {
  margin-top: 1%;
  column-count: 4;
  column-gap: 0.5px;
  margin-right: 13%;
}
</style>

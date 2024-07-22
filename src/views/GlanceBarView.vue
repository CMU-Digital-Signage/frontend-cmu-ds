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
onMounted(() => {
  if (!devices.value) loading.value = true;
});
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-[0.75rem]"
    ></Skeleton>
    <div v-else-if="devices" class="flex flex-col justify-start items-start">
      <div v-for="(device, index) in devices" :key="index">
        <p class="text-[14px]">{{ device.deviceName }} ({{ device.room }})</p>
        <div></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  margin: 1.5rem;
}
</style>

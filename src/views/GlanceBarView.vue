<script setup lang="ts">
import store from "@/store";
import GlanceBarCompo from "@/components/GlanceBarCompo.vue";
import { computed, onMounted, ref, watch } from "vue";

const devices = computed(() =>
  store.state.devices?.sort((a, b) => {
    if (a.room! < b.room!) return -1;
    else if (a.room! > b.room!) return 1;
    else return 1;
  })
);
const loading = ref(false);
const deviceEdit = ref();

onMounted(() => {
  if (!devices.value) loading.value = true;
});

watch(devices, () => {
  if (devices.value) loading.value = false;
});

const handleEdit = (MACaddress: string | undefined) => {
  deviceEdit.value = MACaddress;
};
</script>

<template>
  <div class="rectangle flex flex-col relative">
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-[0.75rem]"
    ></Skeleton>
    <div
      v-else-if="devices"
      v-for="(device, index) in devices"
      :key="index"
      :class="{ 'mt-6 first:mt-0': !deviceEdit }"
    >
      <div
        v-if="!deviceEdit || deviceEdit === device.MACaddress"
        class="flex flex-col h-full gap-2"
      >
        <p class="text-[14px] text-start">
          {{ device.deviceName }} ({{ device.room }})
        </p>
        <GlanceBarCompo
          class="rounded-[12px]"
          :device="device"
          :onEdit="handleEdit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  padding-inline: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin-inline: 0;
  overflow: auto;
}
</style>

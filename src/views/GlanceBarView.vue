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
onMounted(() => {
  if (!devices.value) loading.value = true;
});
</script>

<template>
  <div class="scrollable-container">
    <div class="device-container" v-for="(device, index) in devices" :key="index">
      <p class="device-title">{{ device.deviceName }} ({{ device.room }})</p>
      <div class="device-border">
        <GlanceBarCompo class="rounded-[12px]"
          :deviceName="device.deviceName"
          :room="device.room"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollable-container {
  height: 100vh; /* or any fixed height */
  overflow-y: auto;
  padding: 20px;
}

.device-container {
  margin-bottom: 20px;
}

.device-title {
  font-size: 16px;
  margin-top: 20px;
  text-align: left;
  margin-left: 20px;
}

.device-border {
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
  margin: 15px;
  height: 100%; /* Set a fixed height for each device container */
  padding: 10px;
}
</style>
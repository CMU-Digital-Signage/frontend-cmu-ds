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
  <div class="text-left mt-5 ml-5" style="font-family: sf pro">
    <div v-for="(floor, index) in floors" :key="index">
      <h1 class="font-bold mt-3" style="font-size: 20px">
        {{ floor }}th Floor
      </h1>
      <h1 class="" style="color: blue; font-size: 15px">
        <span>{{
          devices.filter((e) => e.room?.startsWith(floor || "")).length
        }}</span>
        Devices
      </h1>
      <div class="column">
        <div v-for="(device, innerIndex) in devices" :key="innerIndex">
          <DeviceBlock
            v-if="device.room?.startsWith(floor || '')"
            :device="device"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.column {
  margin-top: 1%;
  column-count: 4;
  column-gap: 0.5px;
  margin-right: 13%;
}

.header {
  margin-top: 5;
  margin-left: 5;
  text-align: left;
  font-family: sf pro;
}
</style>

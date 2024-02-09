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
  <div>
    <Button class="button1">
      <i
        class="pi pi-desktop"
        style="font-size: 70px; color: rgb(98, 204, 202)"
      ></i>
      <div>
        <p class="font-bold text-1xl" style="font-size: 20px; color: black">
          <span>{{ device.deviceName }}</span>
        </p>
        <p class="text-1xl" style="color: black">
          Room:
          <span>{{ device.room }}</span>
        </p>
        <p class="text-1xl" style="color: rgb(98, 204, 202)">On</p>
      </div>
    </Button>
  </div>
</template>

<style>
.button1 {
  margin-top: 3px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: rgb(243, 243, 243);
  column-count: 2;
  column-gap: 20px;
  text-align: left;
  border-color: rgb(187, 186, 186);
  padding: 15px 30px;
  font-family: "SF Pro";
}
</style>

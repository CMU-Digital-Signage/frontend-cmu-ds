<script setup lang="ts">
import { computed } from "vue";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});
</script>

<template>
  <TabView v-model:active-index="click" class="rectangle flex flex-col">
    <TabPanel header="Admin">
      <Admin />
    </TabPanel>
    <TabPanel header="Device">
      <Device />
    </TabPanel>
  </TabView>
</template>

<style scoped>
/* Add styles for the rectangle */
.rectangle {
  padding-inline: 1.5rem;
  overflow: hidden;
}

.bold-ho:hover {
  font-weight: 600;
}

.activer-link {
  border-bottom: 4px solid #282828;
  font-weight: 900;
  border-radius: -2-px;
}

.activer-link:hover {
  color: #282828;
  background-color: #f0f0f014; /* Optional: change background color on hover */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional: add box shadow on hover */
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});
const admin = computed(() => store.state.allUser);
const devices = computed(() => store.state.devices);
const loadAdmin = ref(false);
const loadDevice = ref(false);

onMounted(() => {
  if (!admin.value) loadAdmin.value = true;
  if (!devices.value) loadDevice.value = true;
});

watch([admin, devices], () => {
  if (admin.value) loadAdmin.value = false;
  if (devices.value) loadDevice.value = false;
});
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loadAdmin"
      class="bg-gray-200 rounded-xl flex-1 my-[0.75rem]"
    ></Skeleton>
    <TabView v-else v-model:active-index="click" class="flex flex-col">
      <TabPanel header="Admin">
        <Admin />
      </TabPanel>
      <TabPanel header="Device">
        <Skeleton
          v-if="loadDevice"
          class="bg-gray-200 rounded-xl flex-1"
        ></Skeleton>
        <Device v-else />
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped>
/* Add styles for the rectangle */
.rectangle {
  width: 97.5%;
  height: 100%;
  margin-left: 1rem;
  margin-bottom: 2.5rem;
  padding-inline: 1rem;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.15rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

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

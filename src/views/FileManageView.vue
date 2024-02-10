<script setup lang="ts">
import FileTable from "@/components/FileTableCompo.vue";
import { computed, onUnmounted, watch } from "vue";
import store from "../store";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

watch(click, () => {
  store.commit("resetFilter");
});

onUnmounted(() => {
  store.commit("resetFilter");
});
</script>

<template>
  <TabView v-model:activeIndex="click" class="rectangle flex flex-col">
    <TabPanel header="Normal File">
      <FileTable :types="'nor'" />
    </TabPanel>
    <TabPanel
      v-if="store.state.userInfo.isAdmin"
      header="Emergency File"
      :pt="{
        headerAction: {
          class: `${click != 0 ? 'text-[#f00] border-[#f00]' : ''}`,
        },
      }"
    >
      <FileTable :types="'emer'" />
    </TabPanel>
  </TabView>
</template>

<style scoped>
.rectangle {
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

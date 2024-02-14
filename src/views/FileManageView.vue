<script setup lang="ts">
import FileTable from "@/components/FileTableCompo.vue";
import PopupUpload from "@/components/PopupUploadCompo.vue";
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
  <div class="rectangle flex flex-col">
    <PopupUpload />
    <TabView v-if="store.state.userInfo.isAdmin" v-model:activeIndex="click">
      <TabPanel header="Normal File">
        <FileTable :types="'NP'" />
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
        <FileTable :types="'EP'" />
      </TabPanel>
    </TabView>
    <FileTable v-else :types="'NP'" class="rectangle flex flex-col" />
  </div>
</template>

<style scoped>
.rectangle {
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

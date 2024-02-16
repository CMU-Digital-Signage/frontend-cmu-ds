<script setup lang="ts">
import FileTable from "@/components/FileTableCompo.vue";
import PopupUpload from "@/components/PopupUploadCompo.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import store from "../store";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

const uniquePosters = computed(() => store.state.uniquePosters);
const emerPosters = computed(() => store.state.emerPosters);
const loadPoster = ref(false);
const loadEmer = ref(false);

onMounted(() => {
  if (!uniquePosters.value.length) loadPoster.value = true;
  if (!emerPosters.value.length) loadEmer.value = true;
});

watch([uniquePosters, emerPosters], () => {
  if (uniquePosters.value.length) loadPoster.value = false;
  if (emerPosters.value.length) loadEmer.value = false;
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
        <Skeleton v-if="loadPoster" class="bg-gray-200 flex"></Skeleton>
        <FileTable v-else :types="'NP'" />
      </TabPanel>
      <TabPanel
        header="Emergency File"
        :pt="{
          headerAction: {
            class: `${click != 0 ? 'text-[#f00] border-[#f00]' : ''}`,
          },
        }"
      >
        <Skeleton v-if="loadEmer" class="bg-gray-200 flex"></Skeleton>
        <FileTable v-else :types="'EP'" />
      </TabPanel>
    </TabView>
    <Skeleton v-else-if="loadPoster" class="bg-gray-200 flex"></Skeleton>
    <FileTable
      v-else-if="uniquePosters[0].title"
      :types="'NP'"
      class="rectangle flex flex-col"
    />
    <div v-else class="flex justify-center items-center align-middle">
      No Data
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  padding-inline: 1.5rem;
  overflow: hidden;
  background-color: white;
}
</style>

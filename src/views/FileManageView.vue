<script setup lang="ts">
import FileTable from "@/components/FileTableCompo.vue";
import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
import store from "../store";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

const uniquePosters = computed(() => store.state.uniquePosters);
const emerPosters = computed(() => store.state.emerPosters);
const loading = ref(false);

onBeforeMount(() => {
  if (!uniquePosters.value || !emerPosters.value) loading.value = true;
});

watch([uniquePosters, emerPosters], () => {
  if (uniquePosters.value && emerPosters.value) loading.value = false;
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
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-[0.75rem]"
    ></Skeleton>
    <TabView
      v-else-if="store.state.userInfo.isAdmin"
      v-model:activeIndex="click"
    >
      <TabPanel header="Normal File">
        <FileTable v-if="uniquePosters?.length" :types="'NP'" />
        <div
          v-else
          class="my-[0.75rem] flex h-full justify-center items-center align-middle"
        >
          Content not found
        </div>
      </TabPanel>
      <TabPanel
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

    <FileTable
      v-else-if="uniquePosters?.length"
      :types="'NP'"
      class="rectangle flex flex-col"
    />
    <div
      v-else
      class="my-[0.75rem] flex h-full justify-center items-center align-middle"
    >
      Your Content not found
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  width: 100%;
  height: 100%;
  padding-inline: 1rem;
  overflow: hidden;
  padding-top: 0.25rem;
  padding-bottom: 0.15rem;
}
</style>

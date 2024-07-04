<script setup lang="ts">
import ContentTable from "@/components/ContentTableCompo.vue";
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
  <div class="rectangle flex flex-col flex-1">
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-3"
    ></Skeleton>
    <TabView
      v-else-if="store.state.userInfo.isAdmin"
      v-model:activeIndex="click"
      class="flex flex-col flex-1 mb-2 overflow-hidden"
    >
      <TabPanel header="Content">
        <ContentTable v-if="uniquePosters?.length" :types="'NP'" />
        <div v-else class="my-3 justify-center items-center">
          Content not found
        </div>
      </TabPanel>
      <TabPanel
        header="Emergency Content"
        :pt="{
          headerAction: {
            class: `${click != 0 ? 'text-[#f00] border-[#f00]' : ''}`,
          },
        }"
      >
        <ContentTable v-if="emerPosters?.length! > 1" :types="'EP'" />
        <div v-else class="my-3 justify-center items-center">
          Content not found
        </div>
      </TabPanel>
    </TabView>

    <ContentTable
      v-else-if="uniquePosters?.length"
      :types="'NP'"
      class="rectangle flex flex-col"
    />
    <div
      v-else
      class="my-3 flex h-full justify-center items-center align-middle"
    >
      Your Content not found
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  width: 98%;
  height: 100%;
  margin-left: 1rem;
  margin-bottom: 2rem;
  padding-inline: 1rem;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 0.2rem;
  padding-top: 0.25rem;
  padding-bottom: 0.15rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>

<script setup lang="ts">
import ContentTable from "@/components/ContentTableCompo.vue";
import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
import store from "../store";
import { User } from "@/types";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

const user = computed<User>(() => store.state.userInfo);
const uniquePosters = computed(() =>
  user.value.isAdmin
    ? store.state.uniquePosters
    : store.state.uniquePosters?.filter((e) =>
        e.uploader.includes(user.value.firstName)
      )
);
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
  <div class="rectangle flex flex-col flex-1 font-sf-pro">
    <Skeleton
      v-if="loading"
      class="bg-gray-200 rounded-xl flex-1 my-3"
    ></Skeleton>
    <TabView
      v-else-if="user.isAdmin"
      v-model:activeIndex="click"
      class="flex flex-col flex-1 mb-2 text-[14px] overflow-hidden"
    >
      <TabPanel
        header="Content"
        :pt="{
          content: { class: `flex flex-1` },
        }"
      >
        <ContentTable v-if="uniquePosters?.length" :types="'NP'" />
        <div v-else class="flex flex-1 gap-10 justify-center items-center">
          <div class="flex flex-col">
            <p class="text-[16px] font-semibold text-[#575757]">
              Nothing in Content
            </p>
            <p class="text-[12px] mt-1 font-regular">
              Content will be displayed after uploading.
            </p>
          </div>
          <img
            class="w-[420px] h-[420px]"
            alt="cmulogo"
            src="../assets/images/notFound.jpg"
          />
        </div>
      </TabPanel>
      <TabPanel
        header="Emergency Content"
        :pt="{
          headerAction: {
            class: `${click != 0 ? 'text-[#f00] border-[#f00]' : ''}`,
          },
          content: { class: `flex flex-1` },
        }"
      >
        <ContentTable v-if="emerPosters?.length! > 1" :types="'EP'" />
        <div v-else class="flex flex-1 gap-10 justify-center items-center">
          <div class="flex flex-col">
            <p class="text-[16px] font-semibold text-[#575757]">
              Nothing in Emergency Content
            </p>
            <p class="text-[12px] mt-1 font-regular">
              Emergency Content will be displayed after uploading.
            </p>
          </div>
          <img
            class="w-[420px] h-[420px]"
            alt="cmulogo"
            src="../assets/images/notFound.jpg"
          />
        </div>
      </TabPanel>
    </TabView>

    <ContentTable
      v-else-if="uniquePosters?.length"
      :types="'NP'"
      class="rectangle flex flex-col"
    />
    <div v-else class="flex flex-1 gap-10 justify-center items-center">
      <div class="flex flex-col">
        <p class="text-[16px] font-semibold text-[#575757]">
          Nothing in Content
        </p>
        <p class="text-[12px] mt-1 font-regular">
          Your Content will be displayed after uploading.
        </p>
      </div>
      <img
        class="w-[420px] h-[420px]"
        alt="cmulogo"
        src="../assets/images/notFound.jpg"
      />
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

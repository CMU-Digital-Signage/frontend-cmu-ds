<script setup lang="ts">
import NavbarBelow from "@/components/NavbarBelow.vue";
import PopupUpload from "@/components/PopupUploadCompo.vue";
import { computed, ref, onMounted, watch, onUnmounted } from "vue";
import store from "@/store";
import { useRoute } from "vue-router";
import {
  dateFormatter,
  loopPoster,
  calculateScreenHeight,
} from "@/utils/constant";
import { Poster } from "@/types";

const route = useRoute();
const mac = route.params.mac as string;
const filterDate = computed(() => store.state.filterInputPosters.date);
const filterTime = computed(() => store.state.filterInputPosters.time);
const posters = computed(() =>
  store.state.posters.filter(
    (e) =>
      e.MACaddress == mac &&
      dateFormatter(filterDate.value) >= dateFormatter(e.startDate) &&
      dateFormatter(filterDate.value) <= dateFormatter(e.endDate) &&
      filterTime.value.toTimeString() >= e.startTime.toTimeString() &&
      filterTime.value.toTimeString() <= e.endTime.toTimeString()
  )
);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();
const selectPoster = ref<Poster>();
const selectImage = ref("");
let currentindex = 0;

watch(selectPoster, () => {
  if (!selectPoster.value) {
    selectImage.value = "";
  } else {
    selectImage.value = selectPoster.value.image[0].image;
  }
  currentindex = 0;
});

watch([filterDate, filterTime], () => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = "";
});

watch(
  posters,
  () => {
    if (
      !posters.value.find((e) => e.posterId === selectPoster.value?.posterId)
    ) {
      selectPoster.value = undefined;
      selectImage.value = "";
      currentindex = 0;
    }
  },
  { deep: true }
);

onUnmounted(() => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = "";
});

const changeImage = (index: number) => {
  if (selectPoster.value && selectPoster.value.image.length > 1) {
    const newIndex = (currentindex + index) % selectPoster.value.image.length;
    currentindex = newIndex;
    selectImage.value = selectPoster.value.image[newIndex].image;
  }
};

const rowStyle = (rowData: any) => {
  if (rowData === selectPoster.value) {
    return { "background-color": "#caf1d8" };
  }
};
</script>

<template>
  <div class="rectangle">
    <PopupUpload />
    <div class="flex flex-1 flex-wrap py-[25px] gap-6">
      <div
        class="flex flex-1 items-center justify-center w-full lg:w-1/2 rounded-xl border-[3px] border-[#eaeaea] bg-[#ffffff]"
      >
        <button
          v-if="selectPoster && selectPoster.image.length > 1"
          class="pi pi-angle-left text-[50px] mr-5"
          @click="changeImage(-1)"
          :disabled="currentindex == 0"
          :class="
            currentindex == 0
              ? 'text-gray-400 hover:bg-white'
              : 'text-black hover:bg-gray-300 rounded-xl'
          "
        />
        <div
          class="flex justify-center items-center bg-black"
          :style="{
            width: `${2160 / 6.5}px`,
            height: `${3840 / 6.5}px`,
          }"
        >
          <img
            v-if="selectImage"
            class="max-w-full h-full m-auto rotate-90"
            :src="selectImage"
            :style="{
              maxWidth: `${3840 / 6.5}px`,
              maxHeight: `${2160 / 6.5}px`,
            }"
          />
          <transition
            v-else-if="image.key.length"
            enter-active-class="transition duration-500"
            enter-from-class="opacity-0"
            leave-active-class="transition duration-500"
            leave-to-class="opacity-0"
          >
            <img
              class="max-w-full h-full m-auto rotate-90 absolute"
              alt="poster"
              :key="image.key"
              :src="image.image"
              :style="{
                maxWidth: `${3840 / 6.5}px`,
                maxHeight: `${2160 / 6.5}px`,
              }"
            />
          </transition>
          <button
            v-else
            class="pi pi-play text-[#808080] text-5xl"
            @click="stopLoop = loopPoster(posters)"
          />
        </div>
        <button
          v-if="selectPoster && selectPoster.image.length > 1"
          class="pi pi-angle-right text-[50px] ml-5"
          @click="changeImage(1)"
          :disabled="currentindex == selectPoster.image.length - 1"
          :class="
            currentindex == selectPoster.image.length - 1
              ? 'text-gray-400 hover:bg-white'
              : 'text-black hover:bg-gray-300 rounded-xl'
          "
        />
      </div>
      <DataTable
        scrollDirection="vertical"
        scrollable
        :scrollHeight="calculateScreenHeight()"
        class="text-[14px] lg:text-[16px]"
        v-model:selection="selectPoster"
        :value="posters"
        selectionMode="single"
        tableStyle="min-width: 36rem"
        :rowStyle="rowStyle"
      >
        <Column header="No." class="w-1/3">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column field="title" header="Title" class="w-1/3"></Column>
        <Column
          :field="(e) => (e.duration * e.image.length).toString()"
          header="Display duration"
          class="w-1/3"
        ></Column>
      </DataTable>
    </div>
  </div>
  <NavbarBelow v-model="selectPoster" />
</template>

<style scoped>
.rectangle {
  flex: 1 1;
  padding-inline: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

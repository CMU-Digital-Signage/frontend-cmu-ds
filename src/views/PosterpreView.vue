<script setup lang="ts">
import NavbarBelow from "@/components/NavbarBelow.vue";
import { computed, ref, watch, onUnmounted, onMounted } from "vue";
import store from "@/store";
import { useRoute } from "vue-router";
import {
  dateFormatter,
  loopPoster,
  calculateScreenHeight,
  convertUrlToFile,
} from "@/utils/constant";
import { Poster } from "@/types";

const route = useRoute();
const mac = route.params.mac as string;
const filterDate = computed(() => store.state.filterInputPosters.date);
const filterTime = computed(() => store.state.filterInputPosters.time);
const posters = computed(() =>
  store.state.posters?.filter((e) => {
    return (
      e.MACaddress === mac &&
      e.startDate.getTime() <= filterDate.value.getTime() &&
      filterDate.value.getTime() <= e.endDate.getTime() &&
      e.startTime.getTime() <= filterTime.value.getTime() &&
      filterTime.value.getTime() <= e.endTime.getTime()
    );
  })
);
const loading = ref(false);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();
const selectPoster = ref<Poster>();
const selectImage = ref("");
let currentindex = 0;

onMounted(async () => {
  if (posters.value) {
    loading.value = true;
    const promise = posters.value.map(async (e) => {
      await Promise.all(
        e.image.map(async (p) => {
          if (p.image && typeof p.image === "string")
            p.image = await convertUrlToFile(p.image);
        })
      );
    });
    await Promise.all(promise);
    loading.value = false;
  }
});

watch(selectPoster, () => {
  if (!selectPoster.value) {
    selectImage.value = "";
  } else {
    selectImage.value = selectPoster.value.image[0].image.dataURL;
  }
  currentindex = 0;
});

watch([filterDate, filterTime], () => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = null;

  if (
    posters.value &&
    (dateFormatter(filterDate.value) !== dateFormatter(new Date()) ||
      filterTime.value.getHours() !== new Date().getHours() ||
      filterTime.value.getMinutes() !== new Date().getMinutes())
  ) {
    selectPoster.value = posters.value[0];
    selectImage.value = selectPoster.value?.image[0].image.dataURL;
  } else {
    selectPoster.value = undefined;
    selectImage.value = "";
  }
});

watch(
  posters,
  () => {
    if (
      posters.value &&
      selectPoster.value &&
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
  image.value.image = null;
});

const changeImage = (index: number) => {
  if (selectPoster.value && selectPoster.value.image.length > 1) {
    const newIndex = (currentindex + index) % selectPoster.value.image.length;
    currentindex = newIndex;
    selectImage.value = selectPoster.value.image[newIndex].image.dataURL;
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
    <div class="flex flex-1 flex-wrap h-full gap-3">
      <div class="flex flex-1 w-full md:w-1/2">
        <DataTable
          scrollDirection="vertical"
          scrollable
          scrollHeight="flex"
          :virtualScrollerOptions="{ itemSize: 46 }"
          class="text-[14px] lg:text-[14px] w-full"
          v-model:selection="selectPoster"
          :value="posters"
          selectionMode="single"
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
      <div
        class="flex flex-1 w-full md:w-1/2 h-full items-center justify-center rounded-xl border-[3px] border-[#eaeaea] bg-[#ffffff]"
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
        <ProgressSpinner
          v-if="loading"
          strokeWidth="6"
          animationDuration=".5s"
          class="flex flex-col text-center items-center"
        />
        <div
          v-else
          class="flex justify-center items-center"
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
            v-else-if="image.image"
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
            v-else-if="
              posters && dateFormatter(filterDate) === dateFormatter(new Date())
            "
            class="pi pi-play text-[#808080] text-5xl rounded-full p-2 bg-white hover:bg-gray-200"
            @click="stopLoop = loopPoster(posters ?? [])"
          />
          <div v-else>No Content to Preview.</div>
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
    </div>
  </div>
  <NavbarBelow v-model="selectPoster" />
</template>

<style scoped>
.rectangle {
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>

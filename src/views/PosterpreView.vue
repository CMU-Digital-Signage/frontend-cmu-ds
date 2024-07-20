<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import store from "@/store";
import { useRoute } from "vue-router";
import {
  convertUrlToFile,
  dateFormatter,
  rotate,
  setNorForm,
} from "@/utils/constant";
import { Poster } from "@/types";
import { MAP_TYPE } from "@/utils/enum";
import { Carousel3d, Slide } from "vue3-carousel-3d";
import ModalInfoContent from "@/components/Modal/ModalInfoContent.vue";

const route = useRoute();
const mac = route.params.mac as string;
const user = computed(() => store.state.userInfo);
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
const contents = ref<any>([]);
const currentIndex = ref(0);
const loadContents = async () => {
  loading.value = true;
  if (posters.value) {
    const loadedContents = await Promise.all(
      posters.value.flatMap(async (poster) =>
        Promise.all(
          poster.image.map(async (image) => {
            let img = image.image;
            if (poster.type == MAP_TYPE.POSTER) {
              const file = await convertUrlToFile(image.image);
              img = await rotate(file.dataURL, 90);
            }
            return {
              image: img,
              priority: image.priority,
              type: poster.type,
              title: poster.title,
              posterId: poster.posterId,
            };
          })
        )
      )
    );
    contents.value = loadedContents.flat();
    selectPoster.value = posters.value[0];
    currentIndex.value = 0;
  }
  loading.value = false;
};
const loading = ref(false);
const image = computed(() => store.state.currentImage);
const selectPoster = ref<Poster>();
const showInfo = ref(false);
const deletePopup = ref(false);

onMounted(async () => {
  if (posters.value?.length) {
    await loadContents();
  }
});

watch([filterDate, filterTime], async () => {
  image.value.key = "";
  image.value.image = null;

  if (posters.value?.length) {
    await loadContents();
  } else {
    selectPoster.value = undefined;
  }
});

watch(
  posters,
  async () => {
    if (posters.value?.length) {
      await loadContents();
    }
  },
  { deep: true }
);

const onAfterSlideChange = (index: number) => {
  selectPoster.value = posters.value?.find(
    (e) => e.posterId == contents.value.at(index).posterId
  );
  currentIndex.value = index;
};

const closeModalInfoContent = () => {
  showInfo.value = false;
  deletePopup.value = false;
};
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton v-if="loading" class="mt-3 !h-full rounded-lg" />
    <div v-else-if="!posters?.length">No Content to Preview.</div>
    <div v-else class="flex flex-col gap-3">
      <div
        class="flex overflow-auto justify-between text-start border-[#C4C4C4] border-[1px] px-6 rounded-lg"
      >
        <div class="flex flex-row items-center gap-7">
          <div
            class="flex flex-col border-r-[1px] border-[#C4C4C4] my-1 py-2 pr-7"
          >
            <p class="font-semibold text-[16px]">{{ selectPoster?.title }}</p>
            <p
              class="text-[14px]"
              :class="{
                'text-[#856F00]': selectPoster?.type == MAP_TYPE.POSTER,
                'text-[#7054C1]': selectPoster?.type == MAP_TYPE.VIDEO,
                'text-[#2E7DC5]': selectPoster?.type == MAP_TYPE.WEBVIEW,
              }"
            >
              {{ selectPoster?.type }} Content
            </p>
          </div>
          <div class="flex gap-3 items-center">
            <i class="pi pi-user" style="font-size: 1.2rem"></i>
            <div class="flex flex-col text-start text-[14px]">
              <p class="font-semibold">Uploader</p>
              <p class="text-[#6E6E6E]">{{ selectPoster?.uploader }}</p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <i class="pi pi-calendar" style="font-size: 1.2rem"></i>
            <div class="flex flex-col text-[14px]">
              <p class="font-semibold">Uploaded</p>
              <p class="text-[#6E6E6E]">
                {{ dateFormatter(selectPoster?.createdAt, 4) }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9.5 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.583a.5.5 0 0 1 0 .842l-5.576 3.584a.5.5 0 0 1-.77-.42Z"
              />
              <path
                fill="currentColor"
                d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m11-9.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5"
              />
            </svg>
            <div class="flex flex-col text-[14px]">
              <p class="font-semibold">Display duration</p>
              <p class="text-[#6E6E6E]">{{ selectPoster?.duration }} Seconds</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-3">
          <Button
            v-if="user.isAdmin || user.id === selectPoster?.id"
            icon="pi pi-pencil"
            rounded
            class="w-7 h-7"
            severity="warning"
            @click="setNorForm(selectPoster)"
          />
          <Button
            v-if="user.isAdmin || user.id === selectPoster?.id"
            icon="pi pi-trash"
            rounded
            class="w-7 h-7"
            severity="danger"
            @click="deletePopup = true"
          />
        </div>
      </div>
      <div
        class="flex gap-3 text-start text-[14px] border-[#C4C4C4] border-[1px] py-3 px-6 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M3 6a1 1 0 0 0 0 2h26a1 1 0 1 0 0-2zm0 6a1 1 0 1 0 0 2h26a1 1 0 1 0 0-2zm-1 7a1 1 0 0 0 1 1h26a1 1 0 1 0 0-2H3a1 1 0 0 0-1 1m1 5a1 1 0 1 0 0 2h17a1 1 0 1 0 0-2z"
          />
        </svg>
        <div class="flex flex-col">
          <p class="font-semibold">Description</p>
          <p>{{ selectPoster?.description ?? "-" }}</p>
        </div>
      </div>
    </div>
    <Carousel3d
      v-if="posters?.length && !loading"
      :perspective="0"
      :controls-visible="true"
      class="!h-full flex items-center"
      @before-slide-change="onAfterSlideChange"
    >
      <Slide
        v-for="(image, imageIndex) in contents"
        :key="`${image.title}-${image.priority}`"
        :index="imageIndex"
        :class="[
          'border-none !bg-black',
          {
            'cursor-pointer': imageIndex != currentIndex,
            '!flex !m-auto': image.type != MAP_TYPE.WEBVIEW,
          },
        ]"
        :style="{
          width: `${2160 / 10}px`,
          height: `${3840 / 10}px`,
        }"
      >
        <iframe
          v-if="image.type == MAP_TYPE.WEBVIEW"
          title="webview"
          :src="`${image.image}`"
          :width="`${2160 / 2}px`"
          :height="`${3840 / 2}px`"
          scrolling="no"
          fullScreen="true"
          class="overflow-hidden top-full left-0 pointer-events-none"
          style="transform: scale(0.2); transform-origin: 0 0"
        />
        <video
          v-else-if="image.type == MAP_TYPE.VIDEO"
          :controls="image.posterId == selectPoster?.posterId"
          muted
          :src="image.image"
        ></video>
        <img
          v-else
          alt="poster"
          class="max-w-full max-h-full w-fit h-fit m-auto"
          :src="image.image"
        />
      </Slide>
    </Carousel3d>
  </div>
  <ModalInfoContent
    v-if="selectPoster"
    :show="showInfo"
    :data="selectPoster"
    :onClose="closeModalInfoContent"
    :deletecontent="deletePopup"
  />
</template>

<style>
.carousel-3d-container {
  .carousel-3d-slider {
    width: 216px !important;
    height: 384px !important;
  }
}
</style>

<style scoped>
.rectangle {
  margin-inline: 1.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>

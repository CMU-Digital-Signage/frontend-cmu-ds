<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import { getEmergency, getPosterEachDevice } from "@/services";
import { computed, onMounted, ref, watch, onUpdated, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import TextPoster from "@/components/TextPoster.vue";
import { Poster } from "@/types";
import { loopPoster, setFieldPoster } from "@/utils/constant";

const route = useRoute();
const posters = computed(() => store.state.posters);
const emerPoster = computed(() => store.state.emerPosters[0]);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();

const fetchData = async () => {
  const { ok, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  const res = await getEmergency();
  if (res.ok) {
    store.state.emerPosters = res.emergency.filter(
      (e: any) => e.status === true
    );
  }
  if (ok) {
    setFieldPoster(poster);
    poster.sort((a: Poster, b: Poster) => {
      if (a.startTime.toTimeString() < b.startTime.toTimeString()) return -1;
      if (a.startTime.toTimeString() > b.startTime.toTimeString()) return 1;
      return 0;
    });
    store.state.posters = poster;

    stopLoop.value = loopPoster(posters.value, emerPoster.value);
  }
};

onMounted(async () => {
  fetchData();
});

watch(emerPoster, () => {
  if (emerPoster.value) {
    stopLoop.value();
    store.state.currentImage.image = emerPoster.value.emergencyImage;
    store.state.currentImage.key = emerPoster.value.incidentName;
  } else {
    stopLoop.value = loopPoster(posters.value, emerPoster.value);
  }
});

onUnmounted(() => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = "";
});
</script>

<template>
  <div v-if="emerPoster?.incidentName === 'banner'" class="bg-[#FF5252]">
    <div class="rotateText flex justify-center items-center h-screen w-screen">
      <TextPoster />
    </div>
  </div>
  <div v-else class="w-screen h-screen bg-black overflow-hidden">
    <transition
      v-if="image.key.length"
      enter-active-class="transition duration-500"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-500"
      leave-to-class="opacity-0"
    >
      <img
        class="max-w-screen h-screen m-auto transition-opacity"
        alt="poster"
        :key="image.key"
        :src="image.image"
      />
    </transition>
  </div>
</template>

<style>
.rotateText {
  transform: rotate(-90deg);
}
</style>

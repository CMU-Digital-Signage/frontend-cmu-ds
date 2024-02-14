<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import { getPosterEachDevice } from "@/services";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import { setFieldPoster } from "@/utils/constant";
import { ImageCollection, Poster } from "@/types";

const route = useRoute();
const posters = computed(() => store.state.posters);
const emerPoster = computed(() => store.state.emerPosters[0]);
const image = ref<string>();
let currentIndex = 0;
let count = 0;

const fetchData = async () => {
  const { ok, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  if (ok) {
    poster.forEach((e: Poster) => {
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      e.startTime = new Date(e.startTime);
      e.endTime = new Date(e.endTime);
    });
    poster.sort((a: Poster, b: Poster) => {
      if (a.startTime.toTimeString() < b.startTime.toTimeString()) return -1;
      if (a.startTime.toTimeString() > b.startTime.toTimeString()) return 1;
      return 0;
    });
    store.state.posters = poster;

    if (posters.value.length > 0) {
      if (posters.value.length === 1) {
        const currentTime = new Date().toTimeString();
        const currentPoster = posters.value[0];
        if (
          currentPoster.startTime.toTimeString() <= currentTime &&
          currentPoster.endTime.toTimeString() >= currentTime
        ) {
          image.value = posters.value[0].image as any;
          return;
        } else return;
      }
    }
    showCurrentPoster();
  }
};

const showCurrentPoster = () => {
  const updatePosterInterval = () => {
    if (currentIndex === -1) return;
    const currentPoster = posters.value[currentIndex];
    if (
      currentPoster.startTime.toTimeString() <= new Date().toTimeString() &&
      currentPoster.endTime.toTimeString() >= new Date().toTimeString()
    ) {
      if (emerPoster.value) return;

      image.value = currentPoster.image as any;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % posters.value.length;
        updatePosterInterval();
      }, currentPoster.duration * 1000);
    } else {
      currentIndex = findNextValidPosterIndex();
      updatePosterInterval();
    }
  };

  const findNextValidPosterIndex = () => {
    const currentTime = new Date().toTimeString();
    currentIndex = (currentIndex + 1) % posters.value.length;
    const poster = posters.value[currentIndex];
    if (count > posters.value.length) return -1;
    else if (
      poster.startTime.toTimeString() <= currentTime &&
      poster.endTime.toTimeString() >= currentTime
    ) {
      return currentIndex;
    } else {
      count++;
      findNextValidPosterIndex();
    }
    return currentIndex;
  };

  updatePosterInterval();
};

onMounted(() => {
  fetchData();
});

watch(emerPoster, () => {
  if (emerPoster.value) {
    image.value = emerPoster.value.emergencyImage;
  } else {
    showCurrentPoster();
  }
});
</script>

<template>
  <div class="w-screen h-screen bg-black overflow-hidden">
    <transition v-if="image" name="fade">
      <img
        class="max-w-screen h-screen m-auto transition-opacity"
        alt="poster"
        :key="currentIndex"
        :src="image"
      />
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: opacity 0.5s;
}
.v-enter-to {
  position: relative;
  opacity: 1;
}
.v-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

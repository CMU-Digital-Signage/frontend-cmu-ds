<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import { getPosterEachDevice } from "@/services";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Poster } from "@/types";
import store from "@/store";

const route = useRoute();
const posters = computed(() => store.state.posters);
const image = ref<string>();
let currentIndex = 0;

const fetchData = async () => {
  const { ok, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  if (ok) {
    const filteredPoster = poster.sort((a: any, b: any) => {
      const timeA = new Date(a.startTime).getHours();
      const timeB = new Date(b.startTime).getHours();

      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;

      return 0;
    });
    store.commit("setPosters", filteredPoster);

    if (posters.value.length > 0) {
      if (posters.value.length === 1) {
        image.value = posters.value[0].image;
        return;
      }
      showCurrentPoster();
    }
  } else {
    console.log(message);
  }
};

const showCurrentPoster = () => {
  const updatePosterInterval = () => {
    const currentTime = new Date();
    const currentPoster = posters.value[currentIndex];

    if (
      new Date(currentPoster.startTime).getHours() <= currentTime.getHours() &&
      new Date(currentPoster.endTime).getHours() >= currentTime.getHours() &&
      new Date(currentPoster.endTime).getMinutes() > currentTime.getMinutes()
    ) {
      image.value = currentPoster.image;

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
    const currentTime = new Date();
    for (let i = 0; i < posters.value.length; i++) {
      const poster = posters.value[i];
      if (
        new Date(poster.startTime).getHours() <= currentTime.getHours() &&
        new Date(poster.endTime).getHours() >= currentTime.getHours() &&
        new Date(poster.endTime).getMinutes() > currentTime.getMinutes()
      ) {
        return i;
      }
    }

    return 0;
  };

  updatePosterInterval();
};

onMounted(() => {
  fetchData();
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

<style>
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

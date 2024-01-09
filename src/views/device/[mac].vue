<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import { getPosterEachDevice } from "@/services";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Poster } from "@/types";

const route = useRoute();
const posters = ref<Poster[]>([]);
const image = ref<string>();
let currentIndex = 0;

const fetchData = async () => {
  const { ok, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  if (ok) {
    const date = new Date();
    posters.value = poster.filter(
      (e: Poster) =>
        new Date(e.startDate) <= date && new Date(e.endDate) >= date
    );
    if (posters.value.length > 0) {
      showCurrentPoster();
    }
  } else {
    console.log(message);
  }
};

const showCurrentPoster = () => {
  const updatePosterInterval = () => {
    image.value = posters.value[currentIndex].image;
    setTimeout(
      updatePosterInterval,
      posters.value[currentIndex].duration * 1000
    );
    currentIndex = (currentIndex + 1) % posters.value.length;
  };

  updatePosterInterval();
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- <div v-if="message">{{ message }}</div> -->
  <div class="w-screen h-screen bg-black overflow-hidden">
    <transition name="fade">
      <img
        v-if="image"
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

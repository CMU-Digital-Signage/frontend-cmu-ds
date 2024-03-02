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
import {
  loopPoster,
  setFieldPoster,
  dateFormatter,
  timeFormatter,
} from "@/utils/constant";
import { getActivateEmerPoster } from "@/services/pi";
import axios from "axios";

const route = useRoute();
const posters = computed(() => store.state.posters);
const emerPoster = computed(() => store.state.emerPosters[0]);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();
const dateTime = ref(new Date());
let interval: any = null;
let intervalWeather: any = null;
let dateTimeInterval: any = null;
const weather: any = ref();

const fetchWeather = async () => {
  const res = await axios.get("http://api.airvisual.com/v2/nearest_city", {
    params: {
      key: "57eba6d9-0fc6-4ded-96e1-a861bb8a9554",
      lat: "18.79",
      lon: "98.95",
    },
  });
  console.log(res.data.data);
  weather.value = res.data.data;
};

const aqiStatus = () => {
  if (weather.value.current) {
    const aqiValue = weather.value.current.pollution.aqius;
    if (aqiValue <= 50) return "Good";
    else if (aqiValue <= 100) return "Moderate";
    else if (aqiValue <= 150) return "Unhealthy for Sensitive Group";
    else if (aqiValue <= 200) return "Unhealthy";
    else if (aqiValue <= 300) return "Very Unhealthy";
    else return "Harzardous";
  }
};

const fetchData = async () => {
  const { ok, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  await getActivateEmerPoster();
  if (ok) {
    setFieldPoster(poster);
    poster.sort((a: Poster, b: Poster) => {
      if (a.startTime.getTime() < b.startTime.getTime()) return -1;
      if (a.startTime.getTime() > b.startTime.getTime()) return 1;
      return 0;
    });
    store.state.posters = poster;

    stopLoop.value = loopPoster(posters.value, emerPoster.value);
  }
};

onMounted(async () => {
  fetchWeather();
  fetchData();
  dateTimeInterval = setInterval(async () => {
    dateTime.value = new Date();
  }, 1000);
  interval = setInterval(async () => {
    await getActivateEmerPoster();
  }, 1000);
  intervalWeather = setInterval(async () => {
    await fetchWeather();
  }, 3600000);
});

watch(emerPoster, () => {
  if (emerPoster.value) {
    if (stopLoop.value) stopLoop.value();
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
  clearInterval(interval);
  clearInterval(dateTimeInterval);
  clearInterval(intervalWeather);
});
</script>

<template>
  <div v-if="emerPoster?.incidentName === 'banner'" class="bg-[#FF5252]">
    <div class="rotateText flex justify-center items-center h-screen w-screen">
      <TextPoster :text="emerPoster.emergencyImage" />
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
  <div class="containerDateTime">
    <p>{{ dateFormatter(dateTime) }}</p>
    <p>{{ timeFormatter(dateTime) }}</p>
    <div v-if="weather">
      <p>{{ weather?.current?.weather.tp }} °C</p>
      <p
        :class="{
          'text-[#2a8953]': aqiStatus() === 'Good',
          'text-[#95a22f]': aqiStatus() === 'Moderate',
          'text-[#F48D31]': aqiStatus() === 'Unhealthy for Sensitive Group',
          'text-[#CA142D]': aqiStatus() === 'Unhealthy',
          'text-[#62008F]': aqiStatus() === 'Very Unhealthy',
          'text-[#730B22]': aqiStatus() === 'Harzardous',
        }"
      >
        AQI: {{ weather?.current?.pollution.aqius }}
        {{ aqiStatus() }}
      </p>
      
    </div>
  </div>
  <!-- <iframe src="https://main--darling-frangipane-e360a0.netlify.app/" class="absolute bottom-0 right-0 -rotate-90"></iframe> -->
</template>

<style>
.rotateText {
  transform: rotate(-90deg);
}

.containerDateTime {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100vh;
  font-size: 30px;
  color: rgb(0, 0, 0);
  padding: 5px;
  background-color: #fff;
  transform: rotate(-90deg) translate(100%, 0);
  transform-origin: right bottom;
}
</style>

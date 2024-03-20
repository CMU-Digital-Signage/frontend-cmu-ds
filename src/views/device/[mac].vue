<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import { getPosterEachDevice } from "@/services";
import { computed, onMounted, ref, watch, onUnmounted, reactive } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import TextPoster from "@/components/TextPoster.vue";
import { Poster } from "@/types";
import {
  loopPoster,
  setFieldPoster,
  dateFormatter,
  timeFormatter,
  month,
} from "@/utils/constant";
import { getActivateEmerPoster } from "@/services/pi";
import axios from "axios";

const route = useRoute();
const mac = route.params.mac as string;
const roomCPE = ref("");
const showEmer = ref(false);
const showBotMaps = ref(false);
const posters = computed(() => store.state.posters);
const emerPoster = computed(() =>
  store.state.emerPosters ? store.state.emerPosters[0] : undefined
);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();
const dateTime = ref(new Date());
let intervalPoster: any = null;
let intervalEmer: any = null;
let intervalWeather: any = null;
let dateTimeInterval: any = null;
const weather: any = ref();
const iconWeather = ref({ condition: "", image: "" });
const updateWeather = ref(new Date());
const error = reactive({ status: 0, message: "" });

const fetchWeather = async () => {
  const res = await axios.get("https://api.airvisual.com/v2/nearest_city", {
    params: {
      key: "9288827d-21b4-4cb6-91f0-0d306ca02831",
      lat: "18.79",
      lon: "98.95",
    },
  });
  updateWeather.value = new Date();
  weather.value = res.data.data;
};

const aqiStatus = () => {
  if (weather.value?.current) {
    const aqiValue = weather.value.current.pollution.aqius;
    if (aqiValue <= 50) return "Good";
    else if (aqiValue <= 100) return "Moderate";
    else if (aqiValue <= 150) return "Unhealthy (Sensitive Group)";
    else if (aqiValue <= 200) return "Unhealthy";
    else if (aqiValue <= 300) return "Very Unhealthy";
    else return "Hazardous";
  }
};

const fetchData = async () => {
  const { ok, room, poster, message, status } = await getPosterEachDevice(mac);
  if (ok) {
    roomCPE.value = room;
    setFieldPoster(poster);
    poster.sort((a: Poster, b: Poster) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
    store.state.posters = poster;
  } else {
    error.message = message;
    error.status = status;
  }
};

onMounted(async () => {
  await fetchData();
  if (posters.value) {
    fetchWeather();
    await getActivateEmerPoster();
    stopLoop.value = loopPoster(posters.value, emerPoster.value, showBotMaps);
    dateTimeInterval = setInterval(async () => {
      dateTime.value = new Date();
    }, 1000);
    intervalEmer = setInterval(async () => {
      await getActivateEmerPoster();
    }, 1000);
    intervalWeather = setInterval(async () => {
      await fetchWeather();
    }, 1000 * 60 * 30); // fetch every 30 minutes
    intervalPoster = setInterval(async () => {
      await fetchData();
    }, 1000 * 16); // fetch every 16 sec
  }
});

watch(emerPoster, () => {
  if (emerPoster.value) {
    if (stopLoop.value) stopLoop.value();
    showEmer.value = true;
    showBotMaps.value = false;
    store.state.currentImage.image = emerPoster.value.emergencyImage;
    store.state.currentImage.key = emerPoster.value.incidentName;
  } else if (showEmer.value && posters.value) {
    showEmer.value = false;
    stopLoop.value = loopPoster(posters.value, emerPoster.value, showBotMaps);
  }
});

onUnmounted(() => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = null;
  clearInterval(intervalPoster);
  clearInterval(intervalEmer);
  clearInterval(dateTimeInterval);
  clearInterval(intervalWeather);
});
</script>

<template>
  <div
    v-if="error.status"
    class="font-sf-pro flex flex-col h-screen w-screen justify-center items-center"
  >
    <p class="text-6xl font-bold">{{ error.status }}</p>
    <p class="text-xl">{{ error.message }}</p>
  </div>
  <div
    v-else
    class="flex flex-row justify-between h-screen w-screen overflow-hidden"
    :class="{
      'bg-[#ff0000]': emerPoster?.incidentName === 'banner',
      'bg-black': emerPoster?.incidentName !== 'banner',
    }"
  >
    <div
      v-if="emerPoster?.incidentName !== 'banner'"
      class="flex h-screen flex-col w-[11vw] items-center py-6 bg-[#10164b] text-black"
    >
      <div class="flex flex-col gap-6   justify-center items-center rotate-0 " >
        <div
          v-if="roomCPE === '421' || roomCPE === '422' || roomCPE === '400'"
          class="bottomBlock gap-2"
        >
          <div
            class="flex bg-[#10164b] text-yellow-400 text-[48px] justify-center"
          >
            <p class="font-semibold">41X</p>
          </div>
          <div class="flex bg-[#10164b] rotate-90 items-center">
            <img
              class="w-[88px] h-[88px]"
              alt="arrow"
              src="../../assets/images/arrow.png"
            />
          </div>
        </div>
        <div
          v-if="roomCPE === '421' || roomCPE === '422' || roomCPE === '400'"
          class="bottomBlock gap-2"
        >
          <div class="bg-[#10164b] justify-center items-center">
            <img
              class="w-[88px] h-[88px]"
              alt="arrow"
              src="../../assets/images/arrow.png"
            />
          </div>
          <div class="flex flex-col text-yellow-400 text-[52px] justify-center">
            <p class="font-semibold">401</p>
            <p class="font-semibold">402</p>
          </div>
        </div>
      </div>
      <div
        v-if="weather"
        class="bottomBlock items-center justify-center py-3 mt-10 flex-col"
      >
        <div class="flex flex-row h-full">
          <div
            class="items-center flex justify-center rounded-t-lg"
            :class="{
              'bg-[#228b25]': aqiStatus() === 'Good',
              'bg-[#F3BF10]': aqiStatus() === 'Moderate',
              'bg-[#F89049]': aqiStatus() == 'Unhealthy (Sensitive Group)',
              'bg-[#EE4547]': aqiStatus() === 'Unhealthy',
              'bg-[#8A609D]': aqiStatus() === 'Very Unhealthy',
              'bg-[#814C63]': aqiStatus() === 'Hazardous',
              'text-[#0C6515]': aqiStatus() === 'Good',
              'text-[#654E0C]': aqiStatus() === 'Moderate',
              'text-[#571F00]': aqiStatus() === 'Unhealthy (Sensitive Group)',
              'text-[#ffffff]':
                aqiStatus() === 'Good' ||
                aqiStatus() === 'Unhealthy' ||
                aqiStatus() === 'Very Unhealthy' ||
                aqiStatus() === 'Hazardous',
            }"
          >
            <p class="text-2xl py-4 items-center px-2">
              {{ weather?.current?.weather?.tp }} °C
            </p>
          </div>
          <div
            class="flex flex-row rounded-b-lg"
            :class="{
              'bg-[#43a027]': aqiStatus() === 'Good',
              'bg-[#FDD64B]': aqiStatus() === 'Moderate',
              'bg-[#faa166]': aqiStatus() == 'Unhealthy (Sensitive Group)',
              'bg-[#fe5b5b]': aqiStatus() === 'Unhealthy',
              'bg-[#A97ABC]': aqiStatus() === 'Very Unhealthy',
              'bg-[#966B78]': aqiStatus() === 'Hazardous',
              'text-[#0C6515]': aqiStatus() === 'Good',
              'text-[#654E0C]': aqiStatus() === 'Moderate',
              'text-[#571F00]': aqiStatus() === 'Unhealthy (Sensitive Group)',
              'text-[#ffffff]':
                aqiStatus() === 'Good' ||
                aqiStatus() === 'Unhealthy' ||
                aqiStatus() === 'Very Unhealthy' ||
                aqiStatus() === 'Hazardous',
            }"
          >
            <div class="flex flex-col pt-5 pb-3">
              <p class="text-[55px] font-semibold -ml-3">
                {{ weather?.current?.pollution?.aqius }}
              </p>
              <p class="text-[24px] whitespace-nowrap ml-2">US AQI</p>
            </div>
            <div
              class="pb-5 pt-4 text-2xl items-center font-medium flex flex-1 justify-center"
            >
              {{ aqiStatus() }}
            </div>
          </div>
        </div>
        <div class="text-[14px] font-medium text-white mr-3">
          Last update:
          {{ updateWeather.getHours().toString().padStart(2, "0") }}:{{
            updateWeather.getMinutes().toString().padStart(2, "0")
          }}
          | IQAir
        </div>
      </div>
      <div class="bottomBlockGroup h-fit flex-col  font-medium text-[40px] text-white">
        <p class="text-[68px]" >{{ timeFormatter(dateTime) }}</p>
        <p>{{ dateFormatter(dateTime, 3) }}</p>
      </div>
    </div>
    <div v-if="emerPoster?.incidentName === 'banner'" class="flex flex-1">
      <div
        class="rotateText flex justify-center items-center h-screen w-screen -ml-[40px]"
      >
        <TextPoster :text="emerPoster.emergencyImage" />
      </div>
    </div>
    <div
      v-else-if="showBotMaps && roomCPE"
      class="flex flex-1 justify-center items-center"
    >
      <iframe
        title="BOTMATS"
        :src="`https://main--darling-frangipane-e360a0.netlify.app/${roomCPE.charAt(
          0
        )}`"
      ></iframe>
    </div>
    <div v-else class="flex flex-1">
      <transition v-if="image.image" name="fade" mode="out-in">
        <img
          v-if="image.image"
          class="max-w-screen h-screen m-auto duration-500 transition-opacity"
          alt="poster"
          :key="image.key"
          :src="image.image"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.rotateText {
  transform: rotate(-90deg);
}

iframe {
  width: 100vh;
  height: 90vw;
  transform: rotate(-90deg);
}

.bottomBlock {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
  flex: 1 1;
  display: flex;
  align-items: center;
  background-color: #10164b;
  justify-content: center;
}

.bottomBlockGroup {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
  flex: 1 1;
  display: flex;
  align-items: start;
  background-color: #10164b;
  justify-content: start;
}
</style>

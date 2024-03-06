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
const floorCpe = ref("");
const showBotMaps = ref(false);
const posters = computed(() => store.state.posters);
const emerPoster = computed(() =>
  store.state.emerPosters ? store.state.emerPosters[0] : undefined
);
const image = computed(() => store.state.currentImage);
const stopLoop = ref();
const dateTime = ref(new Date());
let interval: any = null;
let intervalWeather: any = null;
let dateTimeInterval: any = null;
const weather: any = ref();
const iconWeather = ref({ condition: "", image: "" });
const updateWeather = ref(new Date());

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
  const weatherValue = weather.value.current.weather.ic;
  if (weatherValue === "01d") {
    iconWeather.value = {
      condition: "Clear",
      image: require("../../assets/images/clearDay.png"),
    };
  } else if (weatherValue === "01n") {
    iconWeather.value = {
      condition: "Clear",
      image: require("../../assets/images/clearNight.jpg"),
    };
  } else if (weatherValue === "02d") {
    iconWeather.value = {
      condition: "Mostly Clear",
      image: require("../../assets/images/clearDay.png"),
    };
  } else if (weatherValue === "02n") {
    iconWeather.value = {
      condition: "Mostly Clear",
      image: require("../../assets/images/clearNight.jpg"),
    };
  } else if (weatherValue === "03d") {
    iconWeather.value = {
      condition: "Partly Cloudy",
      image: require("../../assets/images/partlyCloudy.png"),
    };
  } else if (weatherValue === "09d") {
    iconWeather.value = {
      condition: "Drizzle",
      image: require("../../assets/images/drizzle.png"),
    };
  } else if (weatherValue === "10d" || weatherValue === "10n") {
    iconWeather.value = {
      condition: "Rain",
      image: require("../../assets/images/rain.png"),
    };
  } else if (weatherValue === "11d" || weatherValue === "11n") {
    iconWeather.value = {
      condition: "Thunderstorm",
      image: require("../../assets/images/thunderstorm.png"),
    };
  } else if (weatherValue === "13d") {
    iconWeather.value = {
      condition: "Snow",
      image: require("../../assets/images/snow.png"),
    };
  } else {
    iconWeather.value = {
      condition: "Fog",
      image: require("../../assets/images/fog.png"),
    };
  }
};

const aqiStatus = () => {
  if (weather.value.current) {
    const aqiValue = weather.value.current.pollution.aqius;
    if (aqiValue <= 50) return "Good";
    else if (aqiValue <= 100) return "Moderate";
    else if (aqiValue <= 150) return "Unhealthy (Sensitive Group)";
    else if (aqiValue <= 200) return "Unhealthy";
    else if (aqiValue <= 300) return "Very Unhealthy";
    else return "Harzardous";
  }
};

const fetchData = async () => {
  const { ok, floor, poster, message } = await getPosterEachDevice(
    route.params.mac as string
  );
  await getActivateEmerPoster();
  if (ok) {
    floorCpe.value = floor;

    setFieldPoster(poster);
    poster.sort((a: Poster, b: Poster) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
    store.state.posters = poster;
    if (posters.value)
      stopLoop.value = loopPoster(posters.value, emerPoster.value, showBotMaps);
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
  }, 1800000);
});

watch(emerPoster, () => {
  console.log(emerPoster.value?.emergencyImage);
  
  if (emerPoster.value) {
    if (stopLoop.value) stopLoop.value();
    store.state.currentImage.image = emerPoster.value.emergencyImage;
    store.state.currentImage.key = emerPoster.value.incidentName;
  } else if (posters.value) {
    stopLoop.value = loopPoster(posters.value, emerPoster.value, showBotMaps);
  }
});

onUnmounted(() => {
  if (stopLoop.value) stopLoop.value();
  image.value.key = "";
  image.value.image = null;
  clearInterval(interval);
  clearInterval(dateTimeInterval);
  clearInterval(intervalWeather);
});
</script>

<template>
  <div
    class="flex flex-row justify-between h-screen w-screen overflow-hidden"
    :class="{
      'bg-[#ff0000]': emerPoster?.incidentName === 'banner',
      'bg-black': emerPoster?.incidentName !== 'banner',
    }"
  >
    <div v-if="emerPoster?.incidentName === 'banner'" class="flex flex-1">
      <div
        class="rotateText flex justify-center items-center h-screen w-screen -ml-[40px]"
      >
        <TextPoster :text="emerPoster.emergencyImage" />
      </div>
    </div>
    <div
      v-else-if="showBotMaps && floorCpe"
      class="flex flex-1 justify-center items-center"
    >
      <iframe
        title="BOTMATS"
        :src="`https://main--darling-frangipane-e360a0.netlify.app/${floorCpe}`"
      ></iframe>
    </div>
    <div v-else class="flex flex-1">
      <transition v-if="image.image" name="fade" mode="out-in">
        <img
          class="max-w-screen h-screen m-auto duration-500 transition-opacity"
          alt="poster"
          :key="image.key"
          :src="image.image"
        />
      </transition>
    </div>
    <div
      class="flex flex-col w-[10vw] p-[10px] border-2 rounded-2xl bg-white text-black"
    >
      <div v-if="weather" class="bottomBlock border-t-2">
        <p class="text-[40px]">{{ weather?.current?.weather.tp }} °C</p>
        <div class="inline-flex gap-3">
          <p class="text-[28px] ml-2 -mr-1 font-medium">
            {{ iconWeather.condition }}
          </p>
          <img class="w-8 h-8" :src="iconWeather.image" />
        </div>
        <div class="text-[14px] text-black">
          Last Update:
          {{ updateWeather.getHours().toString().padStart(2, "0") }}:{{
            updateWeather.getMinutes().toString().padStart(2, "0")
          }}
          IQAir
        </div>
      </div>
      <div v-if="weather" class="bottomBlock">
        <div
          :class="{
            'text-[#2a8953]': aqiStatus() === 'Good',
            'text-[#95a22f]': aqiStatus() === 'Moderate',
            'text-[#F48D31]': aqiStatus() === 'Unhealthy (Sensitive Group)',
            'text-[#CA142D]': aqiStatus() === 'Unhealthy',
            'text-[#62008F]': aqiStatus() === 'Very Unhealthy',
            'text-[#730B22]': aqiStatus() === 'Harzardous',
          }"
        >
          <div class="flex-col justify-center items-center">
            <div class="text-[32px]">
              AQI: {{ weather?.current?.pollution.aqius }} <br />
            </div>
            <div class="text-[16px] ml-4 -mr-1 font-medium">
              {{ aqiStatus() }}
            </div>
          </div>
          <div class="text-[12px] text-black">
            Last Update:
            {{ updateWeather.getHours().toString().padStart(2, "0") }}:{{
              updateWeather.getMinutes().toString().padStart(2, "0")
            }}
            IQAir
          </div>
        </div>
      </div>
      <div class="bottomBlock border-b-2 text-[36px]">
        <p>{{ dateFormatter(dateTime) }}</p>
        <p>{{ timeFormatter(dateTime, true) }}</p>
      </div>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

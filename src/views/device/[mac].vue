<script lang="ts">
export default {
  name: "MacView",
};
</script>
<script setup lang="ts">
import {
  getPosterEachDevice,
  getActivateEmerPoster,
  getGlanceBarEachDevice,
} from "@/services";
import { computed, onMounted, ref, watch, onUnmounted, reactive } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import TextPoster from "@/components/TextPoster.vue";
import { Device, Poster } from "@/types";
import {
  loopPoster,
  setFieldPoster,
  dateFormatter,
  timeFormatter,
} from "@/utils/constant";
import axios from "axios";
import { AQI_STATUS, MAP_TYPE } from "@/utils/enum";

const route = useRoute();
const mac = route.params.mac as string;
const showEmer = ref(false);
const posters = computed(() => store.state.posters);
const emerPoster = computed(() =>
  store.state.emerPosters ? store.state.emerPosters[0] : undefined
);
const image = computed(() => store.state.currentImage);
const videoEl = ref<HTMLVideoElement | null>();
const stopLoop = ref();
const dateTime = ref(new Date());
const device = ref<Partial<Device>>();
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
      key: "4f6af6ef-9045-4d4e-b95e-7a125bb11db8",
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
  if (weather.value?.current) {
    const aqiValue = weather.value.current.pollution.aqius;
    if (aqiValue <= 50) return AQI_STATUS.GOOD;
    else if (aqiValue <= 100) return AQI_STATUS.MODERATE;
    else if (aqiValue <= 150) return AQI_STATUS.UNHEALTHY_SG;
    else if (aqiValue <= 200) return AQI_STATUS.UNHEALTHY;
    else if (aqiValue <= 300) return AQI_STATUS.VERY_UNHEALTHY;
    else return AQI_STATUS.HAZARDOUS;
  }
  return AQI_STATUS.GOOD;
};

const fetchData = async () => {
  const { ok, poster, message, status } = await getPosterEachDevice(mac);
  if (ok) {
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

const fetchGlanceBar = async () => {
  const res = await getGlanceBarEachDevice(mac);
  if (res.ok) {
    device.value = res.device;
  } else {
    error.message = res.message;
    error.status = res.status;
  }
};

onMounted(async () => {
  await fetchData();
  if (posters.value) {
    fetchWeather();
    await getActivateEmerPoster();
    stopLoop.value = loopPoster(posters.value, emerPoster.value);
    dateTimeInterval = setInterval(async () => {
      dateTime.value = new Date();
      await fetchGlanceBar();
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

watch(posters, (newPosters, oldPosters) => {
  if (
    newPosters?.length !== oldPosters?.length &&
    posters.value &&
    stopLoop.value
  ) {
    stopLoop.value();
    stopLoop.value = loopPoster(posters.value, emerPoster.value);
  }
});

watch(emerPoster, () => {
  if (emerPoster.value) {
    if (stopLoop.value) stopLoop.value();
    showEmer.value = true;
    store.state.currentImage.image = emerPoster.value.emergencyImage;
    store.state.currentImage.key = emerPoster.value.incidentName;
  } else if (showEmer.value && posters.value) {
    showEmer.value = false;
    stopLoop.value = loopPoster(posters.value, emerPoster.value);
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
    class="flex flex-col h-screen w-screen justify-center items-center"
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
      v-if="!emerPoster"
      class="flex justify-between h-screen flex-col w-[11vw] items-center pb-4 bg-[#ffffff]"
    >
      <div
        class="flex flex-col gap-6 w-full bg-[#0e1235]  p-8 justify-center items-center text-start rotate-0"
      >
        <div
          v-if="device?.color2"
          :class="['bottomBlock gap-2 flex-row-reverse !text-end']"
        >
          <div class="flex justify-center items-center">
            <img
              class="w-[88px] h-[88px]"
              alt="arrow2"
              :src="
                device.color2 === 'green'
                  ? require('../../assets/images/arrowGreen.png')
                  : require('../../assets/images/arrow.png')
              "
              :class="{
                'rotate-90': device.arrow2 === 0,
                'rotate-180': device.arrow2 === 90,
                '-rotate-90': device.arrow2 === 180,
              }"
            />
          </div>
          <div
            class="flex flex-col whitespace-break-spaces text-[52px] justify-center"
            :class="`${
              device.color2 === 'green' ? 'text-green-300' : 'text-yellow-400'
            }`"
          >
            {{ device.desc2?.replace(" ", "\n") }}
          </div>
        </div>
        <div
          v-if="device?.color1"
          :class="[
            'bottomBlock gap-2',
            { 'flex-row-reverse !text-end': device.arrow1 === 0 },
          ]"
        >
          <div class="flex justify-center items-center">
            <img
              class="w-[88px] h-[88px]"
              alt="arrow1"
              :src="
                device.color1 === 'green'
                  ? require('../../assets/images/arrowGreen.png')
                  : require('../../assets/images/arrow.png')
              "
              :class="{
                'rotate-90': device.arrow1 === 0,
                'rotate-180': device.arrow1 === 90,
                '-rotate-90': device.arrow1 === 180,
              }"
            />
          </div>
          <div
            class="flex flex-col whitespace-break-spaces text-[52px] justify-center"
            :class="`${
              device.color1 === 'green' ? 'text-green-300' : 'text-yellow-400'
            }`"
          >
            {{ device.desc1?.replace(" ", "\n") }}
          </div>
        </div>
      </div>
      <div class="bottomBlockAQI items-center justify-center flex-col">
        <div class="flex flex-row h-full w-full">
          <div
            class="items-center flex-col bg-white text-[48px] h-1/2 flex font-semibold justify-center"
          >
            <img alt="weather" class=" size-24" :src="iconWeather.image" />
            <p>{{ weather?.current?.weather?.tp  }} °C</p>
          </div>
          <div
            class="flex flex-row  items-center justify-center h-1/2"
            :class="{
              'bg-[#43a027]': aqiStatus() === AQI_STATUS.GOOD,
              'bg-[#FDD64B]': aqiStatus() === AQI_STATUS.MODERATE,
              'bg-[#faa166]': aqiStatus() == AQI_STATUS.UNHEALTHY_SG,
              'bg-[#fe5b5b]': aqiStatus() === AQI_STATUS.UNHEALTHY,
              'bg-[#A97ABC]': aqiStatus() === AQI_STATUS.VERY_UNHEALTHY,
              'bg-[#966B78]': aqiStatus() === AQI_STATUS.HAZARDOUS,
              'text-[#654E0C]': aqiStatus() === AQI_STATUS.MODERATE,
              'text-[#571F00]': aqiStatus() === AQI_STATUS.UNHEALTHY_SG,
              'text-[#ffffff]':
                aqiStatus() === AQI_STATUS.GOOD ||
                aqiStatus() === AQI_STATUS.UNHEALTHY ||
                aqiStatus() === AQI_STATUS.VERY_UNHEALTHY ||
                aqiStatus() === AQI_STATUS.HAZARDOUS,
            }"
          >
            <div class="flex flex-col justify-center items-center">
              <p class="text-[60px] font-semibold -ml-3">
                {{ weather?.current?.pollution?.aqius  }}
              </p>
              <p class="text-[20px] whitespace-nowrap ml-2">US AQI</p>
              <p class="text-[30px] font-semibold text-wrap whitespace-wrap">{{ aqiStatus() }}</p>
            </div>
            <!-- <div
              class="pb-5 pt-4 text-2xl items-center font-medium flex flex-1 justify-center"
            >
             
            </div> -->
          </div>
        </div>
        <!-- <div class="text-[13px] font-medium text-white mr-3">
          Last updated:
          {{ updateWeather.getHours().toString().padStart(2, "0") }}:{{
            updateWeather.getMinutes().toString().padStart(2, "0")
          }}
          | IQAir
        </div> -->
      </div>
      <div class="bottomBlockGroup h-fit flex-col text-[44px] text-black">
        <p class="text-[72px] font-semibold">{{ timeFormatter(dateTime) }}</p>
        <p class="font-medium text-[40px]">{{ dateFormatter(dateTime, 3) }}</p>
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
      v-else
      class="flex-1"
      :class="{ 'overflow-hidden relative': image.type !== MAP_TYPE.POSTER }"
    >
      <transition v-if="image.image" name="fade" mode="out-in">
        <iframe
          v-if="image.type == MAP_TYPE.WEBVIEW && image.image"
          title="webview"
          :src="image.image"
          scrolling="no"
          fullScreen="true"
          class="absolute overflow-hidden pointer-events-none duration-500 transition-opacity"
        ></iframe>
        <video
          v-else-if="image.type == MAP_TYPE.VIDEO && image.image"
          ref="videoEl"
          muted
          autoplay
          :src="image.image"
          class="absolute m-auto duration-500 transition-opacity"
        ></video>
        <img
          v-else-if="image.image"
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
* {
  font-family: "Lato", "Sarabun";
}

iframe {
  width: 100vh;
  height: 90vw;
  transform: rotate(-90deg);
  top: 100%;
  left: 0;
  transform-origin: 0 0;
}

video {
  width: 100vh;
  height: 90vw;
  transform: rotate(-90deg);
  top: 100%;
  left: 0;
  transform-origin: 0 0;
}

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

.bottomBlock {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
  /* flex: 1 1; */
  height: fit-content;
  display: flex;
  align-items: center;
  background-color: #0e1235;
  justify-content: center;
}

.bottomBlockAQI {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
  /* flex: 1 1; */
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  justify-content: center;
}

.bottomBlockGroup {
  writing-mode: vertical-rl;
  transform: scale(-1, -1);
  /* flex: 1 1; */
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  justify-content: center;
}
</style>

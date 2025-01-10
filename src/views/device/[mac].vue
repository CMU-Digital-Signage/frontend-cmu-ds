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

  const weatherValue = weather.value?.current.weather.ic;
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
    store.state.currentImage.type = "EP";
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
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      justify-content: center;
      align-items: center;
    "
  >
    <p style="font-size: 60px; line-height: 1; font-weight: 700">
      {{ error.status }}
    </p>
    <p style="font-size: 20px; line-height: 1.75rem">
      {{ error.message }}
    </p>
  </div>
  <div
    v-else
    :style="{
      backgroundColor:
        emerPoster?.incidentName === 'banner' ? '#ff0000' : 'black',
    }"
    style="
      display: flex;
      flex-direction: row;
      height: 100vh;
      width: 100vw;
      justify-content: space-between;
      overflow: hidden;
    "
  >
    <div
      v-if="!emerPoster"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
        width: 11vw;
        overflow: hidden;
        padding-bottom: 16px;
        background-color: #0e1235;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          background-color: #0e1235;
          height: 40%;
          padding: 32px;
          justify-content: center;
          align-items: center;
          text-align: start;
          transform: rotate(0deg);
        "
      >
        <div
          v-if="device?.color2"
          style="
            writing-mode: vertical-rl;
            transform: scale(-1, -1);
            display: flex;
            align-items: center;
            background-color: #0e1235;
            justify-content: center;
            gap: 8px;
            height: 50%;
            flex-direction: row-reverse;
            text-align: end !important;
          "
        >
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <img
              :class="{
                rotate90: device.arrow2 === 0,
                rotate180: device.arrow2 === 90,
                rotateMinus90: device.arrow2 === 180,
              }"
              style="width: 88px; height: 88px"
              alt="arrow2"
              :src="
                device.color2 === 'green'
                  ? require('../../assets/images/arrowGreen.png')
                  : require('../../assets/images/arrow.png')
              "
            />
          </div>
          <div
            :class="{
              colorDirectionGreen: device.color2 === 'green',
              colorDirectionYellow: device.color2 === 'yellow',
            }"
            style="
              display: flex;
              flex-direction: column;
              white-space: break-spaces;
              font-size: 52px;
              justify-content: center;
            "
          >
            {{ device.desc2?.replace(" ", "\n") }}
          </div>
        </div>
        <div
          v-if="device?.color1"
          :class="{ 'important-text-align': device.arrow1 === 0 }"
          :style="{
            writingMode: 'vertical-rl',
            transform: 'scale(-1, -1)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0e1235',
            justifyContent: 'center',
            gap: '8px',
            height: device?.color2 ? '50%' : '100%',
            flexDirection: device.arrow1 === 0 ? 'row-reverse' : undefined,
          }"
        >
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <img
              :class="{
                rotate90: device.arrow1 === 0,
                rotate180: device.arrow1 === 90,
                rotateMinus90: device.arrow1 === 180,
              }"
              style="width: 88px; height: 88px"
              alt="arrow1"
              :src="
                device.color1 === 'green'
                  ? require('../../assets/images/arrowGreen.png')
                  : require('../../assets/images/arrow.png')
              "
            />
          </div>
          <div
            :class="{
              colorDirectionGreen: device.color1 === 'green',
              colorDirectionYellow: device.color1 === 'yellow',
            }"
            style="
              display: flex;
              flex-direction: column;
              white-space: break-spaces;
              font-size: 52px;
              justify-content: center;
            "
          >
            {{ device.desc1?.replace(" ", "\n") }}
          </div>
        </div>
      </div>
      <div
        style="
          writing-mode: vertical-rl;
          transform: scale(-1, -1);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20%;
          flex-direction: column;
        "
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
          "
          :class="{
            aqiGood: aqiStatus() === AQI_STATUS.GOOD,
            aqiModerate: aqiStatus() === AQI_STATUS.MODERATE,
            aqiConcern: aqiStatus() == AQI_STATUS.UNHEALTHY_SG,
            aqiUnhealthy: aqiStatus() === AQI_STATUS.UNHEALTHY,
            aqiVeryUnhealthy: aqiStatus() === AQI_STATUS.VERY_UNHEALTHY,
            aqiHazardous: aqiStatus() === AQI_STATUS.HAZARDOUS,
          }"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <p style="font-size: 60px; line-height: 1; font-weight: 700">
              {{ weather?.current?.pollution?.aqius }}
            </p>
            <p style="font-size: 22px; white-space: nowrap">US AQI</p>
            <p
              style="
                font-size: 36px;
                line-height: 40px;
                font-weight: 600;
                text-wrap: wrap;
              "
            >
              {{ aqiStatus() }}
            </p>
          </div>
        </div>
      </div>
      <div
        style="
          writing-mode: vertical-rl;
          transform: scale(-1, -1);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20%;
          display: flex;
          flex-direction: column;
          background-color: #0e1235;
          font-size: 48px;
          color: white;
          font-weight: 600;
        "
      >
        <img
          alt="weather"
          style="width: 96px; height: 96px"
          :src="iconWeather.image"
        />
        <p>{{ weather?.current?.weather?.tp }} °C</p>
      </div>
      <div
        style="
          writing-mode: vertical-rl;
          transform: scale(-1, -1);
          width: 100%;
          display: flex;
          align-items: center;
          background-color: #0e1235;
          justify-content: center;
          color: white;
          height: 20%;
          flex-direction: column;
          font-size: 44px;
        "
      >
        <p style="font-size: 70px; font-weight: 600">
          {{ timeFormatter(dateTime) }}
        </p>
        <p style="font-size: 36px; font-weight: 500">
          {{ dateFormatter(dateTime, 3) }}
        </p>
      </div>
    </div>
    <div
      v-if="emerPoster?.incidentName === 'banner'"
      style="display: flex; flex: 1 1 0%"
    >
      <div
        class="rotateText"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          margin-left: -40px;
        "
      >
        <TextPoster :text="emerPoster.emergencyImage" />
      </div>
    </div>
    <div
      v-else
      :class="{ hiddenRelative: image.type !== MAP_TYPE.POSTER }"
      style="flex: 1 1 0%"
    >
      <transition v-if="image.image" name="fade" mode="out-in">
        <iframe
          v-if="image.type == MAP_TYPE.WEBVIEW && image.image"
          title="webview"
          :src="
            (image.image as string).endsWith('.pdf')
              ? `${image.image}#toolbar=0&navpanes=0&view=Fit`
              : image.image
          "
          class="transitionPoster"
          scrolling="no"
          fullScreen="true"
          style="position: absolute; overflow: hidden; pointer-events: none"
        ></iframe>
        <video
          v-else-if="image.type == MAP_TYPE.VIDEO && image.image"
          ref="videoEl"
          muted
          autoplay
          :src="image.image"
          class="transitionPoster"
          style="position: absolute; margin: auto"
        ></video>
        <img
          v-else-if="image.image"
          class="transitionPoster"
          style="height: 100vh; margin: auto"
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

.colorDirectionGreen {
  color: #86efac;
}

.colorDirectionYellow {
  color: #facc15;
}

.rotate90 {
  transform: rotate(90deg);
}
.rotate180 {
  transform: rotate(180deg);
}
.rotateMinus90 {
  transform: rotate(-90deg);
}

iframe,
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

.important-text-align {
  text-align: end !important;
}

.hiddenRelative {
  overflow: hidden;
  position: relative;
}

.transitionPoster {
  transition-duration: 500ms;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.aqiGood {
  background-color: #43a027;
  color: white;
}

.aqiModerate {
  background-color: #fdd64b;
  color: #654e0c;
}

.aqiConcern {
  background-color: #faa166;
  color: #571f00;
}

.aqiUnhealthy {
  background-color: #fe5b5b;
  color: white;
}

.aqiVeryUnhealthy {
  background-color: #a97abc;
  color: white;
}

.aqiHazardous {
  background-color: #966b78;
  color: white;
}
</style>

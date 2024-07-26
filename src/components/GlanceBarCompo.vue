<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "GlanceBarCompo",
});
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { dateFormatter, timeFormatter } from "@/utils/constant";
import BottomPanel from "./BottomPanel.vue";

const isSplit = ref(false);
const isPanelOpen = ref(false);
const handleOpenPanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
  isSplit.value = !isSplit.value;
};

interface WeatherData {
  current: {
    weather: {
      tp: number;
    };
    pollution: {
      aqius: number;
    };
  };
}

const dateTime = ref<Date>(new Date());
const weather = ref<WeatherData | null>(null);
const updateWeather = ref<Date>(new Date());

let dateTimeInterval: number | undefined;
let weatherInterval: number | undefined;

onUnmounted(() => {
  if (dateTimeInterval) window.clearInterval(dateTimeInterval);
  if (weatherInterval) window.clearInterval(weatherInterval);
});
</script>

<template>
  <div class="glance-bar-container rounded-lg">
    <div class="section items-start ml-5 ">
      <div class="text-5xl md:text-6xl lg:text-7xl font-bold">{{ timeFormatter(dateTime) }}</div>
      <div class="text-2xl md:text-3xl lg:text-4xl">{{ dateFormatter(dateTime, 3) }}</div>
    </div>
    <div class="weather-section items-center justify-center py-5 flex-col font-sf-pro-rounded mt-2">
      <div class="flex flex-col md:flex-row h-full justify-center">
        <div class="items-center flex justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none bg-[#228b25] text-[#0C6515]">
          <p class="text-xl md:text-2xl py-2 px-4 md:px-3">35 °C</p>
        </div>
        <div class="flex flex-row rounded-b-lg md:rounded-r-lg md:rounded-bl-none bg-[#43a027] text-[#0C6515]">
          <div class="flex flex-col pt-1 pb-3 pl-4 md:py-5">
            <p class="text-4xl md:text-5xl font-semibold text-center">30</p>
            <p class="text-xl md:text-2xl whitespace-nowrap text-center">US AQI</p>
          </div>
          <div class="pb-5 pt-4 text-xl md:text-2xl items-center font-medium flex flex-1 justify-center pl-4 pr-6">
            Good
          </div>
        </div>
      </div>
      <div class="text-xs text-center md:text-sm font-medium text-white mr-3 font-sf-pro-rounded mt-2">
        Last updated:
        {{ updateWeather.getHours().toString().padStart(2, "0") }}:{{
          updateWeather.getMinutes().toString().padStart(2, "0")
        }}
        | IQAir
      </div>
    </div>
    <div class="section items-end extra-section-container">
      <div v-if="isSplit" class="split-sections">
        <div class="extra-section">
          <span class="text-xl md:text-2xl font-bold">1</span>
        </div>
        <div class="extra-section">
          <span class="text-xl md:text-2xl font-bold">2</span>
        </div>
      </div>
      <button v-else class="extra-section" @click="handleOpenPanel">
        <span class="text-xl md:text-2xl font-bold">+</span>
      </button>
    </div>
  </div>
  <BottomPanel v-if="isPanelOpen" @close="handleOpenPanel"/>
</template>

<style scoped>
.glance-bar-container {
  width: 100%;
  min-height: 100vh;
  background-color: #0e1235;
  color: white;
  font-family: "SF Pro Rounded", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

@media (min-width: 768px) {
  .glance-bar-container {
    flex-direction: row;
    min-height: 100%;
  }
}

.section {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .section {
    width: 33.33%;
    align-items: flex-start;
  }
}

.weather-section {
  width: 100%;
  max-width: 400px;
  margin: 1rem 0;
}

@media (min-width: 768px) {
  .weather-section {
    margin: 0;
  }
}

.extra-section-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 40%;
  gap: 10px;
  justify-content: flex-end;
}

.extra-section {
  width: 90%;
  height: 15vh;
  border: 2px dashed white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: transparent;
  
}

@media (min-width: 768px) {
  .extra-section {
    height: 25vh;
  }
}

.split-sections {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 90%;
  height: 100%;
  justify-content: flex-end;
}

.glance-bar-container {
  position: relative;
  z-index: 1;
}
</style>
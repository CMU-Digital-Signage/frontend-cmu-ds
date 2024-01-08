<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ScheduleForm",
});
</script>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import store from "@/store";
import { all } from "axios";
import { customDateFormatter } from "@/utils/constant";

const device = computed(() => store.state.devices);

const timeAllDay = ref();
const startDate = ref();
const endDate = ref();
const Stime = ref();
const Etime = ref();
const duration = ref();
const handleDurationInput = () => {
  if (duration.value > 60) {
    duration.value = 60;
  }
};
const allDevice = ref();
watch(startDate, (newValue) => {
  if (newValue) {
    endDate.value = null;
  }
});
watch(timeAllDay, (newValue) => {
  if (newValue) {
    Stime.value = null;
    Etime.value = null;
  }
});
</script>

<template>
  <div class="font-sf-pro flex flex-col justify-start gap-6">
    <!-- Date -->
    <div class="flex flex-row gap-4 items-center text-[18px] text-[#282828]">
      <div class="flex-col justify-start">
        <label for="StartDate" class="flex justify-start mb-2 font-semibold">
          Start Date
        </label>
        <Calendar
          v-model="startDate"
          showIcon
          inputId="startDate"
          :minDate="new Date()"
          :dateFormat="customDateFormatter(startDate)"
          class="flex justify-start w-[170px]"
        />
      </div>
      <p class="pt-9">to</p>
      <div class="flex-col justify-start">
        <label for="EndDate" class="flex justify-start mb-2 font-semibold">
          End Date
        </label>
        <Calendar
          v-model="endDate"
          showIcon
          inputId="EndDate"
          :dateFormat="customDateFormatter(endDate)"
          :minDate="startDate"
          class="flex justify-start w-[170px]"
          :disabled="!startDate"
        />
      </div>
    </div>

    <!-- Time -->
    <div class="flex flex-col justify-start gap-2">
      <label
        for="Time"
        class="flex justify-start font-semibold text-[18px] text-[#282828]"
      >
        Time
      </label>
      <div class="flex gap-4 items-center">
        <Checkbox v-model="timeAllDay" value="" :binary="true" />
        <label>All-day</label>
      </div>
      <!-- Time Range -->
      <div class="flex flex-row gap-4">
        <div
          class="flex flex-row gap-4 items-center text-[18px] text-[#282828]"
        >
        
          <Calendar
            v-model="Stime"
            showIcon
            iconDisplay="input"
            timeOnly
            inputId="Stime"
            :stepMinute="60"
            class="w-[170px]"
            :disabled="timeAllDay"
        
          >
            <template #inputicon="{ clickCallback }">
              <i class="pi pi-clock" @click="clickCallback" />
            </template>
          </Calendar>
          <p>to</p>
          <Calendar
            v-model="Etime"
            showIcon
            iconDisplay="input"
            timeOnly
            inputId="Etime"
            :stepMinute="60"
            class="w-[170px]"
            :disabled="!Stime"
          >
            <template #inputicon="{ clickCallback }">
              <i class="pi pi-clock" @click="clickCallback" />
            </template>
          </Calendar>
        </div>
        <!-- add time range -->
        <Button icon="pi pi-plus" class="w-15 rounded-lg"></Button>
      </div>
    </div>

    <!-- Display Duration-->
    <div class="flex flex-col gap-4">
      <label
        for="duration"
        class="flex justify-start font-semibold text-[18px] text-[#282828]"
      >
        Display Duration
      </label>
      <div class="flex flex-row items-center gap-4 text-[16px] text-[#000]">
        <InputNumber
          v-model="duration"
          inputId="minmax-buttons"
          mode="decimal"
          showButtons
          :min="0"
          :max="60"
        >
        </InputNumber>
        <p>sec</p>
      </div>
    </div>

    <!-- Device -->
    <div class="flex flex-col gap-3">
      <label
        for="Device"
        class="flex justify-start font-semibold text-[18px] text-[#282828]"
      >
        Device
      </label>
      <div class="flex flex-col gap-4 text-[16px] text-black">
        <div class="flex gap-3 items-center">
          <Checkbox v-model="allDevice" :value="all" />
          <label>All Device</label>
        </div>

        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in device"
            :key="index"
            class="flex gap-3 items-center w-1/4"
          >
            <div v-if="item.deviceName" class="flex gap-3 items-center">
              <Checkbox
                :key="index"
                v-model="item.MACaddress"
                :inputId="item.deviceName"
                name="category"
                :value="item.deviceName"
              />
              <label :for="item.deviceName">{{ item.deviceName }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

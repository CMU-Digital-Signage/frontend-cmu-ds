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
const duration = ref();
const allDevice = ref();
const timeRanges = ref([
  {
    startTime: new Date("2024-01-01T08:00:00"),
    endTime: new Date("2024-01-01T09:00:00"),
  },
]);

const addTimeRange = () => {
  const newStartTime = timeRanges.value[timeRanges.value.length - 1].endTime;
  newStartTime.setHours(newStartTime.getHours() + 1);
  const newEndTime = new Date(newStartTime);
  newEndTime.setHours(newEndTime.getHours() + 1);
  timeRanges.value.push({ startTime: newStartTime, endTime: newEndTime });
};
const calculateMinHourStart = (index: number): Date | undefined => {
  if (index >= 0 && timeRanges.value.length > index) {
    const currentRange = timeRanges.value[index];

    const minStartTime = new Date(currentRange.endTime.getTime());
    minStartTime.setHours(minStartTime.getHours() + 1);

    return minStartTime;
  }
  return undefined;
};
const calculateMinHour = (index: number): Date | undefined => {
  if (index >= 0 && timeRanges.value.length > index) {
    const currentRange = timeRanges.value[index];

    if (currentRange.startTime !== null) {
      const minEndTime = new Date(currentRange.startTime.getTime());
      minEndTime.setHours(minEndTime.getHours() + 1);

      return minEndTime;
    }
  }
  return undefined;
};
const calculateMaxHour = (index: number): Date | undefined => {
  if (index >= 0 && timeRanges.value.length > index) {
    const currentRange = timeRanges.value[index];

    if (currentRange.endTime !== null) {
      const maxEndTime = new Date(currentRange.endTime.getTime());
      maxEndTime.setHours(maxEndTime.getHours() - 1);
      return maxEndTime;
    }
  }
  return undefined;
};

watch(startDate, (newStartDate) => {
  if (newStartDate) {
    endDate.value = null;
  }
});
</script>

<template>
  <div class="overflow-y-auto">
    <div class="font-sf-pro flex flex-col justify-start gap-5">
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
        <div class="flex flex-row items-start gap-3">
          <div class="flex flex-col gap-4">
            <div v-for="(timeRange, index) in timeRanges" :key="index">
              <div
                class="flex flex-row gap-4 items-center text-[18px] text-[#282828]"
              >
                <Calendar
                  v-model="timeRange.startTime"
                  showIcon
                  iconDisplay="input"
                  timeOnly
                  :inputId="'Stime_' + index"
                  :stepMinute="60"
                  class="w-[170px]"
                  :maxDate="calculateMaxHour(index)"
                  :minDate="calculateMinHourStart(index)"
                  :disabled="timeAllDay"
                >
                  <template #inputicon="{ clickCallback }">
                    <i class="pi pi-clock" @click="clickCallback" />
                  </template>
                </Calendar>
                <p>to</p>
                <Calendar
                  v-model="timeRange.endTime"
                  showIcon
                  iconDisplay="input"
                  timeOnly
                  :inputId="'Etime_' + index"
                  :stepMinute="60"
                  class="w-[170px]"
                  :minDate="calculateMinHour(index)"
                  :disabled="!timeRange.startTime || timeAllDay"
                >
                  <template #inputicon="{ clickCallback }">
                    <i class="pi pi-clock" @click="clickCallback"></i>
                  </template>
                </Calendar>
              </div>
            </div>
          </div>
          <!-- add time range -->
          <Button
            icon="pi pi-plus"
            @click="addTimeRange"
            class="w-15 rounded-lg"
          ></Button>
        </div>
      </div>

      <!-- Display Duration-->
      <div class="flex flex-col gap-2">
        <label
          for="duration"
          class="flex justify-start font-semibold text-[18px] text-[#282828]"
        >
          Display Duration
        </label>
        <div
          class="flex flex-row items-center gap-4 text-[16px] text-[#000] w-[10px]"
        >
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
            <Checkbox v-model="allDevice" :value="all" :binary="true" />
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
                  :disabled="allDevice"
                  :binary="!allDevice ? false : true"
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
  </div>
</template>

<style></style>

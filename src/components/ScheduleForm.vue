<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ScheduleForm",
});
</script>
<script setup lang="ts">
import { computed, defineProps, toRefs, onUpdated } from "vue";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import store from "@/store";
import { customDateFormatter } from "@/utils/constant";

const props = defineProps<{ index: number }>();
const { index } = toRefs(props);
const device = computed(() => store.state.devices);
const formDisplay = computed(() => store.state.formDisplay[index.value]);

onUpdated(() => {
  if (
    formDisplay.value.startDate &&
    formDisplay.value.startDate > formDisplay.value.endDate!
  ) {
    store.state.formDisplay[index.value].endDate = undefined;
  } else if (
    formDisplay.value.time[index.value].startTime &&
    formDisplay.value.time[index.value].endTime &&
    formDisplay.value.time[index.value].startTime.toTimeString() >
      formDisplay.value.time[index.value].endTime!.toTimeString()
  ) {
    store.state.formDisplay[index.value].time[index.value].endTime = undefined;
  }
});

const minStartDate = () => {
  if (index.value > 0 && store.state.formDisplay[index.value - 1].endDate) {
    const min = new Date(store.state.formDisplay[index.value - 1].endDate!);
    min.setDate(min.getDate() + 1);
    return min;
  } else return new Date();
};

const addTime = () => {
  const newStartTime = formDisplay.value.time.at(
    formDisplay.value.time.length - 1
  )?.endTime;
  newStartTime?.setHours(newStartTime.getHours() + 1);
  const newEndTime = new Date(newStartTime!);
  newEndTime?.setHours(newEndTime.getHours() + 1);
  const payload = {
    index: index.value,
    time: { startTime: newStartTime, endTime: newEndTime },
  };
  store.commit("addTime", payload);
};

const deleteTime = (i: number) => {
  store.commit("removeTime", { index: index.value, timeIndex: i });
};

const minStartTime = (i: number) => {
  if (i > 0) {
    const min = new Date(formDisplay.value.time[i - 1].endTime!);
    min.setHours(min.getHours() + 1);
    return min;
  }
};

const maxStartTime = (i: number) => {
  if (i >= 0) {
    const max = new Date(formDisplay.value.time[i].endTime!);
    max.setHours(max.getHours() - 1);
    return max;
  }
};

const minEndTime = (i: number) => {
  const min = new Date(formDisplay.value.time[i].startTime);
  min.setHours(min.getHours() + 1);
  return min;
};

const maxEndTime = (i: number) => {
  if (i < formDisplay.value.time.length - 1) {
    const max = new Date(formDisplay.value.time[i + 1].startTime);
    max.setHours(max.getHours() - 1);
    return max;
  }
};
</script>

<template>
  <div class="mt-5">
    <div class="font-sf-pro flex flex-col justify-start gap-5">
      <!-- Date -->
      <div class="flex flex-row gap-4 items-center text-[18px] text-[#282828]">
        <div class="flex-col justify-start">
          <label class="flex justify-start mb-2 font-semibold">
            Start Date
          </label>
          <Calendar
            v-model="formDisplay.startDate"
            showIcon
            dateFormat="dd/mm/yy"
            :minDate="minStartDate()"
            @date-select="formDisplay.startDate?.setHours(23, 59, 59, 0)"
            class="flex justify-start w-[170px]"
          />
        </div>
        <p class="pt-9">to</p>
        <div class="flex-col justify-start">
          <label for="EndDate" class="flex justify-start mb-2 font-semibold">
            End Date
          </label>
          <Calendar
            v-model="formDisplay.endDate"
            showIcon
            dateFormat="dd/mm/yy"
            :minDate="formDisplay.startDate"
            @date-select="formDisplay.endDate?.setHours(23, 59, 59, 0)"
            class="flex justify-start w-[170px]"
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
          <Checkbox v-model="formDisplay.allDay" :binary="true" />
          <label>All-day</label>
        </div>
        <!-- Time Range -->
        <div class="flex flex-row items-star gap-3">
          <div v-if="!formDisplay.allDay" class="flex flex-col gap-4">
            <div v-for="(time, i) in formDisplay.time" :key="i">
              <div class="flex flex-row gap-2 items-center">
                <div
                  class="flex flex-row gap-4 items-center text-[18px] text-[#282828]"
                >
                  <Calendar
                    v-model="time.startTime"
                    showIcon
                    iconDisplay="input"
                    timeOnly
                    :stepMinute="30"
                    class="w-[170px]"
                    :maxDate="maxStartTime(i)"
                    :minDate="minStartTime(i)"
                    :manualInput="false"
                  >
                    <template #inputicon="{ clickCallback }">
                      <i class="pi pi-clock" @click="clickCallback" />
                    </template>
                  </Calendar>
                  <p>to</p>
                  <Calendar
                    v-model="time.endTime"
                    showIcon
                    iconDisplay="input"
                    timeOnly
                    :stepMinute="30"
                    class="w-[170px]"
                    :minDate="minEndTime(i)"
                    :maxDate="maxEndTime(i)"
                    :disabled="!time.startTime || formDisplay.allDay"
                    :manualInput="false"
                  >
                    <template #inputicon="{ clickCallback }">
                      <i class="pi pi-clock" @click="clickCallback"></i>
                    </template>
                  </Calendar>
                </div>
                <Button
                  v-if="i === 0"
                  icon="pi pi-plus"
                  @click="addTime"
                  class="w-8 h-8 rounded-lg"
                  :disabled="formDisplay.allDay || !time.endTime"
                ></Button>
                <Button
                  v-if="i !== 0"
                  icon="pi pi-minus"
                  @click="deleteTime(i)"
                  severity="danger"
                  class="w-8 h-8 rounded-lg"
                ></Button>
              </div>
            </div>
          </div>
          <!-- add time range -->
          <div></div>
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
        <div class="flex flex-row items-center gap-4 text-[16px] text-[#000]">
          <InputNumber
            v-model="formDisplay.duration"
            inputId="minmax-buttons"
            mode="decimal"
            showButtons
            :min="0"
            :max="60"
            :inputStyle="{ width: '80px' }"
          />
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
            <Checkbox v-model="formDisplay.allDevice" :binary="true" />
            <label>All Device</label>
          </div>
          <div class="flex flex-wrap">
            <div
              v-for="(item, i) in device"
              :key="i"
              class="flex gap-3 items-center w-1/4"
            >
              <div v-if="item.deviceName" class="flex gap-3 items-center">
                <Checkbox
                  v-model="formDisplay.MACaddress"
                  :disabled="formDisplay.allDevice"
                  :binary="!formDisplay.allDevice ? false : true"
                  :value="item.MACaddress"
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

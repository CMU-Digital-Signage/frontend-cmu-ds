<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ScheduleForm",
});
</script>
<script setup lang="ts">
import { computed, defineProps, toRefs, watch } from "vue";
import store from "@/store";

const props = defineProps<{ index: number }>();
const { index } = toRefs(props);
const device = computed(() => store.state.devices);
const formDisplay = computed(() => store.state.formDisplay[index.value]);

watch(
  () => store.state.formDisplay[index.value].startDate!,
  () => {
    if (
      formDisplay.value.startDate &&
      formDisplay.value.endDate &&
      formDisplay.value.startDate.getTime() >
        formDisplay.value.endDate.getTime()
    ) {
      store.state.formDisplay[index.value].endDate =
        formDisplay.value.startDate;
    }
  }
);

const changeStartTime = (i: number) => {
  if (
    formDisplay.value.time[i].startTime !== undefined &&
    formDisplay.value.time[i].endTime &&
    formDisplay.value.time[i].startTime!.getTime() >=
      formDisplay.value.time[i].endTime!.getTime()
  ) {
    store.state.formDisplay[index.value].time[i].endTime = new Date(
      formDisplay.value.time[i].startTime!.getFullYear(),
      formDisplay.value.time[i].startTime!.getMonth(),
      formDisplay.value.time[i].startTime!.getDate(),
      formDisplay.value.time[i].startTime!.getHours(),
      formDisplay.value.time[i].startTime!.getMinutes() + 30,
      formDisplay.value.time[i].startTime!.getSeconds()
    );
    changeEndTime(i);
  }
};

const changeEndTime = (i: number) => {
  if (
    formDisplay.value.time[i].endTime !== undefined &&
    formDisplay.value.time[i + 1] &&
    formDisplay.value.time[i].endTime!.getTime() >=
      formDisplay.value.time[i + 1].startTime!.getTime()
  ) {
    store.state.formDisplay[index.value].time[i + 1].startTime = new Date(
      formDisplay.value.time[i].endTime!.getFullYear(),
      formDisplay.value.time[i].endTime!.getMonth(),
      formDisplay.value.time[i].endTime!.getDate(),
      formDisplay.value.time[i].endTime!.getHours(),
      formDisplay.value.time[i].endTime!.getMinutes() + 30,
      formDisplay.value.time[i].endTime!.getSeconds()
    );
    changeStartTime(i + 1);
  }
};

const addTime = () => {
  const newStartTime = new Date(
    formDisplay.value.time[formDisplay.value.time.length - 1].endTime!
  );
  newStartTime?.setHours(newStartTime.getHours() + 1);
  const newEndTime = new Date(newStartTime);
  newEndTime?.setHours(newEndTime.getHours() + 1);

  if (newStartTime.getHours() !== 0) {
    store.state.formDisplay[index.value].time.push({
      startTime: newStartTime,
      endTime: newEndTime,
    });
  }
};

const deleteTime = (i: number) => {
  store.state.formDisplay[index.value].time.splice(i, 1);
};

const maxStartDate = () => {
  if (store.state.formDisplay[index.value + 1]) {
    const max = new Date(store.state.formDisplay[index.value + 1].startDate!);
    max.setDate(max.getDate() - 1);
    return max;
  }
};

const maxEndDate = () => {
  if (store.state.formDisplay[index.value + 1]) {
    const max = new Date(store.state.formDisplay[index.value + 1].startDate!);
    max.setDate(max.getDate() - 1);
    return max;
  }
};

const minStartDate = () => {
  if (index.value > 0 && store.state.formDisplay[index.value - 1].endDate) {
    const min = new Date(store.state.formDisplay[index.value - 1].endDate!);
    min.setDate(min.getDate() + 1);
    return min;
  } else return new Date();
};

const minStartTime = (i: number) => {
  if (i > 0) {
    const min = new Date(formDisplay.value.time[i - 1].endTime!);
    min.setMinutes(min.getMinutes() + 30);
    return min;
  }
};

const minEndTime = (i: number) => {
  const min = new Date(formDisplay.value.time[i].startTime!);
  min.setMinutes(min.getMinutes() + 30);
  return min;
};
</script>

<template>
  <div class="mt-5">
    <div class="flex flex-col justify-start gap-5">
      <!-- Running Time -->
      <div class="flex flex-col justify-start gap-2">
        <div class="inline-flex items-center">
          <label
            for="Time"
            class="flex justify-start font-semibold text-[18px] text-[#4e93f3]"
          >
            Running Time
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <div class="flex gap-4 ml-7 items-center mt-1 mb-1">
          <RadioButton v-model="formDisplay.allDay" :value="true" />
          <label>All-Day</label>
          <RadioButton v-model="formDisplay.allDay" :value="false" />
          <label>Time range</label>
        </div>
        <!-- Time Range -->
        <div class="flex flex-row items-star gap-3">
          <div v-show="!formDisplay.allDay" class="flex flex-col gap-4">
            <div v-for="(time, i) in formDisplay.time" :key="`${index}-${i}`">
              <div class="flex flex-row gap-2 items-center">
                <div
                  class="flex flex-row gap-4 items-center text-[18px] text-[#282828]"
                >
                  <Calendar
                    v-model="time.startTime"
                    showIcon
                    iconDisplay="input"
                    timeOnly
                    :manualInput="false"
                    :stepMinute="30"
                    class="w-[200px] ml-7"
                    :minDate="minStartTime(i)"
                    @update:model-value="changeStartTime(i)"
                  >
                    <template #inputicon="{ clickCallback }">
                      <i class="pi pi-clock" @click="clickCallback" />
                    </template>
                  </Calendar>
                  <p class="text-gray-600">to</p>
                  <Calendar
                    v-model="time.endTime"
                    showIcon
                    iconDisplay="input"
                    timeOnly
                    :manualInput="false"
                    :stepMinute="30"
                    class="w-[200px]"
                    :minDate="minEndTime(i)"
                    @update:model-value="changeEndTime(i)"
                    :disabled="!time.startTime || formDisplay.allDay"
                  >
                    <template #inputicon="{ clickCallback }">
                      <i class="pi pi-clock" @click="clickCallback"></i>
                    </template>
                  </Calendar>
                </div>
                <Button
                  v-if="i === 0"
                  icon="pi pi-plus"
                  style="color: rgb(255, 255, 255)"
                  @click="addTime()"
                  class="w-8 h-8 rounded-lg bg-blue-500 border-0"
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

      <!-- Running Date -->
      <div class="flex flex-col justify-start gap-2">
        <div class="inline-flex items-center">
          <label
            class="flex justify-start font-semibold text-[18px] text-[#4e93f3]"
          >
            Running Date
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <div class="flex flex-row items-star gap-3">
          <div class="flex flex-row gap-2 items-center">
            <div
              class="flex flex-row gap-4 items-center text-[18px] text-[#4e93f3]"
            >
              <Calendar
                v-model="formDisplay.startDate"
                showIcon
                iconDisplay="input"
                inputId="icondisplay"
                dateFormat="dd M yy"
                :minDate="minStartDate()"
                :maxDate="maxStartDate()"
                @date-select="formDisplay.startDate?.setHours(23, 59, 59, 0)"
                class="flex justify-start w-[200px] ml-7"
              />
              <p class="text-gray-600">to</p>
              <Calendar
                v-model="formDisplay.endDate"
                showIcon
                iconDisplay="input"
                inputId="icondisplay"
                dateFormat="dd M yy"
                :disabled="!formDisplay.startDate"
                :minDate="formDisplay.startDate"
                :maxDate="maxEndDate()"
                @date-select="formDisplay.endDate?.setHours(23, 59, 59, 0)"
                class="flex justify-start w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Display Duration-->
      <div class="flex flex-col mt-1 gap-2">
        <div class="inline-flex items-center">
          <label
            for="duration"
            class="flex justify-start font-semibold text-[18px] text-[#4e93f3]"
          >
            Display Duration
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <div class="flex flex-row items-center gap-4 text-[16px] text-[#000]">
          <InputNumber
            v-model="formDisplay.duration"
            inputId="minmax-buttons"
            mode="decimal"
            class="ml-7 w-[150px]"
            showButtons
            showButton
            :min="0"
            :max="15"
            :inputStyle="{ width: '70px' }"
          />
          <p class="text-gray-600">seconds</p>
        </div>
      </div>

      <!-- Device -->
      <div class="flex flex-col gap-3 mt-1">
        <div class="inline-flex items-center">
          <label
            for="Device"
            class="flex justify-start font-semibold text-[18px] text-[#4e93f3]"
          >
            Device
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <div class="flex flex-col gap-4 text-[16px] text-black">
          <div class="flex gap-2 items-center ml-7">
            <Checkbox v-model="formDisplay.allDevice" :binary="true" />
            <label>All Devices</label>
          </div>
          <div class="flex flex-wrap ml-7">
            <div
              v-for="(item, i) in device"
              :key="i"
              class="flex gap-2 items-center w-1/4"
            >
              <div v-if="item.deviceName" class="flex gap-2 items-center">
                <div>
                  <Checkbox
                    v-model="formDisplay.MACaddress"
                    :disabled="formDisplay.allDevice"
                    :binary="!formDisplay.allDevice ? false : true"
                    :value="item.MACaddress"
                  />
                </div>
                <div>
                  <label :for="item.deviceName">{{ item.deviceName }}</label>
                  <br />
                  <!-- New line -->
                  <label :for="item.deviceName">{{
                    "(" + item.room + ")"
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

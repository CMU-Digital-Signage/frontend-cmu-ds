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
  <div class="mt-5 flex gap-5">
    <div class="flex flex-col justify-start gap-5">
      <!-- Running Show -->
      <div class="flex flex-col justify-start gap-2">
        <div class="inline-flex items-center">
          <label
            for="Time"
            class="flex justify-start font-semibold text-[14px] text-black"
          >
            Running Show
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>

        <div class="flex flex-col justify-start gap-2">
          <div class="flex flex-row items-star gap-3">
            <div
              class="flex flex-row gap-4 items-center text-[18px] text-[#4e93f3]"
            >
              <Calendar
                :pt="{
                  input: { class: 'rounded-md text-[12px]' },
                }"
                v-model="formDisplay.startDate"
                showIcon
                iconDisplay="input"
                inputId="icondisplay"
                dateFormat="dd M yy"
                :minDate="minStartDate()"
                :maxDate="maxStartDate()"
                @date-select="formDisplay.startDate?.setHours(23, 59, 59, 0)"
                class="flex justify-start w-[140px] h-8"
              />
              <p class="text-gray-600 text-[14px]">to</p>
              <Calendar
                :pt="{
                  input: { class: 'rounded-md text-[12px]' },
                }"
                v-model="formDisplay.endDate"
                showIcon
                iconDisplay="input"
                inputId="icondisplay"
                dateFormat="dd M yy"
                :disabled="!formDisplay.startDate"
                :minDate="formDisplay.startDate"
                :maxDate="maxEndDate()"
                @date-select="formDisplay.endDate?.setHours(23, 59, 59, 0)"
                class="flex justify-start w-[140px] h-8 rounded-md text-[12px] disabled:bg-slate-300"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3 mt-1 mb-1">
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="formDisplay.allDay"
              :value="true"
              :pt="{
                box: (slotProps) => ({
                  class: [
                    {
                      'border-[#14C6A4] bg-[#14C6A4]':
                        slotProps.context.checked,
                    },
                  ],
                }),
              }"
            />
            <label class="text-[12px]">All-day</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="formDisplay.allDay"
              :value="false"
              :pt="{
                box: (slotProps) => ({
                  class: [
                    {
                      'border-[#14C6A4] bg-[#14C6A4]':
                        slotProps.context.checked,
                    },
                  ],
                }),
              }"
            />
            <label class="text-[12px]">Time range</label>
          </div>
        </div>
        <!-- Time Range -->
        <div class="flex w-full items-star gap-3">
          <div v-show="!formDisplay.allDay" class="flex flex-col">
            <div v-for="(time, i) in formDisplay.time" :key="`${index}-${i}`">
              <div class="flex gap-4 items-center">
                <div class="flex gap-4 items-center text-[18px] text-[#282828]">
                  <Calendar
                    :pt="{
                      input: { class: 'rounded-md text-[12px]' },
                    }"
                    v-model="time.startTime"
                    showIcon
                    iconDisplay="input"
                    icon="pi pi-clock"
                    timeOnly
                    :manualInput="false"
                    :stepMinute="30"
                    class="w-[100px] mb-3"
                    :minDate="minStartTime(i)"
                    @update:model-value="changeStartTime(i)"
                  />
                  <p class="text-gray-600 mb-1 h-8 text-[14px]">to</p>
                  <Calendar
                    :pt="{
                      input: { class: 'rounded-md text-[12px]' },
                    }"
                    v-model="time.endTime"
                    showIcon
                    iconDisplay="input"
                    icon="pi pi-clock"
                    timeOnly
                    :manualInput="false"
                    :stepMinute="30"
                    class="w-[100px] mb-3 h-8"
                    :minDate="minEndTime(i)"
                    @update:model-value="changeEndTime(i)"
                    :disabled="!time.startTime || formDisplay.allDay"
                  />
                </div>
                <Button
                  v-if="i === 0"
                  icon="pi pi-plus"
                  @click="addTime()"
                  class="w-8 h-8 mb-3 rounded-lg bg-[#14C6A4] border-0"
                  :disabled="formDisplay.allDay || !time.endTime"
                ></Button>
                <Button
                  v-if="i !== 0"
                  icon="pi pi-trash"
                  @click="deleteTime(i)"
                  class="w-8 h-8 mb-3 rounded-lg bg-[#ff6961] border-[#ff6961] hover:bg-[#ed5a52]"
                ></Button>
              </div>
            </div>
          </div>
          <!-- add time range -->
        </div>
      </div>

      <!-- Display Duration-->
      <div class="flex flex-col -mt-4 gap-2">
        <div class="inline-flex items-center">
          <label
            for="duration"
            class="flex justify-start font-semibold text-[14px] text-black"
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
            class="w-[100px] h-8 rounded-md text-[12px]"
            showButtons
            showButton
            :min="0"
            :max="15"
            :inputStyle="{
              width: '70px',
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              fontSize: '12px',
            }"
            :pt="{
              input: { class: 'rounded-md text-[12px] ' },
            }"
          />
          <p class="text-gray-600 text-[12px]">Seconds</p>
        </div>
      </div>

      <!-- Device -->
      <div class="flex flex-col gap-3">
        <div class="inline-flex items-center">
          <label
            for="Device"
            class="flex justify-start font-semibold text-[14px] text-black"
          >
            Device
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <div class="flex flex-col gap-3 text-[16px] text-black">
          <div class="flex gap-2 items-center">
            <Checkbox v-model="formDisplay.allDevice" :binary="true" />
            <label class="text-[12px]">All Devices</label>
          </div>
          <div class="flex flex-col mb-3 text-[12px] gap-3">
            <div v-for="(item, i) in device" :key="i">
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
                  <span>
                    <label :for="item.deviceName">{{
                      " (" + "Room " + item.room + ")"
                    }}</label>
                  </span>
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

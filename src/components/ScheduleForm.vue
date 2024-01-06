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
          class="flex justify-start w-[170px]"
        />
      </div>
    </div>

    <!-- Time -->
    <div class="flex flex-col justify-start gap-4">
      <label
        for="Time"
        class="flex justify-start font-semibold text-[18px] text-[#282828]"
      >
        Time
      </label>
      <div class="flex gap-3 items-center">
        <Checkbox v-model="timeAllDay" value="0:00-23:59" />
        <label>All-Day</label>
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
            class="w-[170px]"
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
            class="w-[170px]"
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
      <div class="flex flex-row items-center gap-4 text-[16px] text-[#000] ">
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
    <div class="">
      <label
        for="Duration"
        class="flex justify-start font-semibold text-[18px] text-[#282828]"
      >
        Device
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";

export default defineComponent({
  components: {
    Calendar,
    Checkbox,
    InputNumber,
  },
  setup() {
    const timeAllDay = ref();
    const startDate = ref(null);
    const endDate = ref(null);
    const Stime = ref();
    const Etime = ref();
    const duration = ref();
    const handleDurationInput = () => {
      if (duration.value > 60) {
        duration.value = 60;
      }
    };

    return {
      startDate,
      endDate,
      timeAllDay,
      Stime,
      Etime,
      duration,
      handleDurationInput,
    };
  },
});
</script>

<style></style>

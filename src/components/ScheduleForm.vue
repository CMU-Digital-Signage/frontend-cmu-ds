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
    <div class="flex flex-col justify-start">
      <label
        for="Time"
        class="flex justify-start mb-2 font-semibold text-[18px] text-[#282828]"
      >
        Time
      </label>
      <div class="flex gap-3 items-center">
        <Checkbox v-model="timeAllDay" value="0:00-23:59" />
        <label>All-Day</label>
      </div>
      <Calendar id="calendar-timeonly" v-model="time" timeOnly>
          <template #inputicon="{ clickCallback }">
            <i class="pi pi-clock text-black" @click="clickCallback"></i>
          </template>
      </Calendar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";

export default defineComponent({
  components: {
    Calendar,
    Checkbox,
  },
  setup() {
    const timeAllDay = ref();
    const startDate = ref(null);
    const endDate = ref(null);
    const time = ref();
    return {
      startDate,
      endDate,
      timeAllDay,
      time,
    };
  },
});
</script>

<style></style>

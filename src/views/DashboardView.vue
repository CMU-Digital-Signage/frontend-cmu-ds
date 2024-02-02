<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DashboardView",
  components: {},
});
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import router from "@/router";
import store from "@/store";
import FullCalendar from "@fullcalendar/vue3";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const fullCalendar = ref(null);

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin],
  initialView: "dayGridMonth",
  // headerToolbar: false,
  headerToolbar: {
    start: "prev,next today",
    center: "title",
    end: "dayGridMonth,timeGridDay",
  },
  height: innerHeight*0.9,
}) as CalendarOptions;
</script>
<template>
  <div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
  </div>
</template>

<style></style>

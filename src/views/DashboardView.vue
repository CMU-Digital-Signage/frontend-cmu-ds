<script lang="ts">
import { defineComponent } from "vue";
import { getPoster } from "@/services";
export default defineComponent({
  name: "DashboardView",
  components: {},
});
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, onUpdated, computed } from "vue";
import router from "@/router";
import store from "@/store";
import FullCalendar from "@fullcalendar/vue3";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const calendarEl = ref(null);
const posters = computed(() => store.state.posters);

onMounted(async () => {
  const res = await getPoster("");
  if (res.ok) {
    res.poster.forEach((e: any) => {
      e.createdAt = new Date(e.createdAt);
      e.updatedAt = new Date(e.updatedAt);
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      e.startRecur = new Date(e.startDate);
      e.endRecur = new Date(e.endDate);
      e.startTime = new Date(e.startTime);
      e.endTime = new Date(e.endTime);
    });
    console.log(res.poster);
    // const temp = res.poster
    store.commit("setPosters", res.poster);
  }
  const calendar = new Calendar(calendarEl.value!, {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: false,
    height: innerHeight * 0.9,
    events: posters.value,
  });
  calendar.render();
  store.commit("setCurrentViewDate", calendar.view.title);

  document.getElementById("prev")!.addEventListener("click", function () {
    calendar.prev();
    store.commit("setCurrentViewDate", calendar.view.title);
  });

  document.getElementById("next")!.addEventListener("click", function () {
    calendar.next();
    store.commit("setCurrentViewDate", calendar.view.title);
  });

  document.getElementById("today")!.addEventListener("click", function () {
    calendar.today();
    store.commit("setCurrentViewDate", calendar.view.title);
  });

  document.getElementById("dayView")!.addEventListener("click", function () {
    calendar.changeView("timeGridDay");
    calendar;
  });

  document.getElementById("monthView")!.addEventListener("click", function () {
    calendar.changeView("dayGridMonth");
  });
});
</script>

<template>
  <div ref="calendarEl" class="m-3"></div>
</template>

<style>
/* .fc .fc-toolbar.fc-header-toolbar {
  height: 3.5rem;
  padding-inline: 1.5rem;
  margin: 0;
  background: #ffffff;
  border-bottom-width: 2px;
  border-color: #f3f4f6;
}

.fc-toolbar-chunk {
  display: flex;
  flex-direction: row;
}

.fc .fc-toolbar-title {
  width: 145px;
  font-family: "SF Pro";
  font-weight: 600;
  font-size: 18px;
  color: #777777;
  display: flex;
  align-items: center;
}

.fc .fc-view-harness {
  margin: 0.5rem;
}

.fc .fc-button {
  background-color: rgba(255, 255, 255, 0);
  border-width: 0;
  color: #777777;
  border-radius: 50px;
}

.fc-today-button {
  background-color: #777777;
} */
</style>

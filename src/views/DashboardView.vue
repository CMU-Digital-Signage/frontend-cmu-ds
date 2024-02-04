<script lang="ts">
import { defineComponent } from "vue";
import { getPoster } from "@/services";
import { color } from "@/utils/constant";
import Dialog from "primevue/dialog";
export default defineComponent({
  name: "DashboardView",
  components: {},
});
</script>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUpdated, computed } from "vue";
import router from "@/router";
import store from "@/store";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const showInfo = ref(false);
const selectedEvent = ref<any>(null);
const calendarEl = ref<any>(null);
const calendar = ref<Calendar>();
const selectedDevice = computed(() => store.state.selectDevice);
const posters = computed(() => store.state.posters);
const postersView = ref<any[]>([]);

const setEvent = () => {
  postersView.value = [];
  const posterOnDevice = posters.value.filter(
    (e) => e.MACaddress === selectedDevice.value
  );
  posterOnDevice.forEach((e) => {
    const allDay =
      e.startTime.toTimeString().includes("00:00") &&
      e.endTime.toTimeString().includes("23:59");
    const exist = postersView.value.find((p) => p.title === e.title);
    let schedule = null;
    // oneDay allTime
    if (allDay && e.startDate.toDateString() === e.endDate.toDateString()) {
      schedule = {
        start: e.startDate,
        end: e.endDate,
      };
    }
    // oneDay
    else if (
      !allDay &&
      e.startDate.toDateString() === e.endDate.toDateString()
    ) {
      schedule = {
        start: new Date(
          e.startDate.getFullYear(),
          e.startDate.getMonth(),
          e.startDate.getDate(),
          e.startTime.getHours(),
          e.startTime.getMinutes()
        ),
        end: new Date(
          e.endDate.getFullYear(),
          e.endDate.getMonth(),
          e.endDate.getDate(),
          e.endTime.getHours(),
          e.endTime.getMinutes()
        ),
      };
    }
    // allTime manyDay
    else if (
      allDay &&
      e.startDate.toDateString() !== e.endDate.toDateString()
    ) {
      schedule = {
        start: e.startDate,
        end: e.endDate,
      };
    }
    // manyDay
    else {
      schedule = {
        startRecur: e.startDate,
        endRecur: e.endDate,
        startTime: e.startTime.toTimeString(),
        endTime: e.endTime.toTimeString(),
      };
    }

    postersView.value.push({
      allDay: allDay,
      display: "block",
      title: e.title,
      backgroundColor: exist
        ? exist.backgroundColor
        : color.at(postersView.value.length),
      ...schedule,
    });
  });
  console.log(calendar.value?.getEvents());
  calendar.value?.removeAllEvents();
  calendar.value?.addEventSource(postersView.value);
};

onMounted(async () => {
  const res = await getPoster("");
  if (res.ok) {
    res.poster.forEach((e: any) => {
      e.createdAt = new Date(e.createdAt);
      e.updatedAt = new Date(e.updatedAt);
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      e.startTime = new Date(e.startTime);
      e.endTime = new Date(e.endTime);
    });
    store.commit("setPosters", res.poster);
    setEvent();
  }
  calendar.value = new Calendar(calendarEl.value!, {
    timeZone: "Asia/Bangkok",
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: "dayGridMonth",
    fixedWeekCount: false,
    headerToolbar: false,
    height: innerHeight * 0.9,
    events: postersView.value,
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
    eventClick: function (info) {
      selectedEvent.value = {
        title: info.event.title,
        start:
          info.event._def.recurringDef?.typeData.startRecur.toDateString() ||
          info.event.start?.toDateString(),
        end:
          info.event._def.recurringDef?.typeData.endRecur.toDateString() ||
          info.event.end?.toDateString(),
        allDay: info.event.allDay,
        startTime: info.event._instance?.range.start
          .toUTCString()
          .slice(17, 22),
        endTime: info.event._instance?.range.end.toUTCString().slice(17, 22),
      };
      showInfo.value = true;
    },
  });
  calendar.value?.render();
  store.commit("setCurrentViewDate", calendar.value?.view.title);

  document.getElementById("prev")!.addEventListener("click", function () {
    calendar.value?.prev();
    store.commit("setCurrentViewDate", calendar.value?.view.title);
  });

  document.getElementById("next")!.addEventListener("click", function () {
    calendar.value?.next();
    store.commit("setCurrentViewDate", calendar.value?.view.title);
  });

  document.getElementById("today")!.addEventListener("click", function () {
    calendar.value?.today();
    store.commit("setCurrentViewDate", calendar.value?.view.title);
  });

  document.getElementById("dayView")!.addEventListener("click", function () {
    calendar.value?.changeView("timeGridDay");
    store.commit("setCurrentViewDate", calendar.value?.view.title);
  });

  document.getElementById("monthView")!.addEventListener("click", function () {
    calendar.value?.changeView("dayGridMonth");
    store.commit("setCurrentViewDate", calendar.value?.view.title);
  });
});

watch(selectedDevice, () => {
  setEvent();
});
</script>

<template>
  <div ref="calendarEl" class="m-3"></div>
  <Dialog v-model:visible="showInfo" modal>
    <template #header>
      <div>{{ selectedEvent.title }}</div>
    </template>
    <div>
      <p>Start Date : {{ selectedEvent.start }}</p>
      <p>End Date : {{ selectedEvent.end }}</p>
      <p v-if="selectedEvent.allDay">Time : All Day</p>
      <p v-else>
        Time : {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
      </p>
    </div>
  </Dialog>
</template>

<style></style>

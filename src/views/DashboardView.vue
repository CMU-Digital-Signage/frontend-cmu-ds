<script lang="ts">
import { defineComponent } from "vue";
import { getPoster } from "@/services";
import { color, customDateFormatter, day } from "@/utils/constant";
export default defineComponent({
  name: "DashboardView",
  components: {},
});
</script>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, onUpdated } from "vue";
import store from "@/store";
import FullCalendar from "@fullcalendar/vue3";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const loading = computed(() => store.state.loading);
const showInfo = ref(false);
const selectedEvent = ref<any>(null);
const fullCalendar = ref<any>(null);
const calendar = ref<Calendar>();
const selectedDevice = computed(() => store.state.selectDevice);
const posters = computed(() => store.state.posters);
const postersView = ref<any[]>([]);
const calOptions = reactive<CalendarOptions>({
  timeZone: "Asia/Bangkok",
  plugins: [dayGridPlugin, timeGridPlugin],
  initialView: "dayGridMonth",
  dayMaxEventRows: true,
  views: {
    timeGrid: {
      dayMaxEventRows: 6,
    },
    dayGrid: {
      dayMaxEventRows: 4,
    },
  },
  fixedWeekCount: false,
  headerToolbar: false,
  height: innerHeight * 0.9,
  windowResize: function (view) {
    calendar.value?.updateSize();
  },
  eventDisplay: "block",
  events: postersView.value,
  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  },
  slotLabelFormat: [
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
  ],
  eventClick: function (info) {
    const start = info.event._def.recurringDef?.typeData.startRecur;
    const end = info.event._def.recurringDef?.typeData.endRecur || null;
    const endMinus1 = end
      ? new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate() - 1,
          end.getHours(),
          end.getMinutes()
        )
      : info.event.end
      ? new Date(
          info.event.end.getFullYear(),
          info.event.end.getMonth(),
          info.event._def.extendedProps.oneDay
            ? info.event.end.getDate()
            : info.event.end.getDate() - 1,
          info.event.end.getHours(),
          info.event.end.getMinutes()
        )
      : null;

    selectedEvent.value = {
      color: info.event.backgroundColor,
      title: info.event.title,
      start: customDateFormatter(start || info.event.start),
      end: customDateFormatter(endMinus1 || info.event.start),
      allDay: info.event.allDay,
      startTime: info.event._instance?.range.start.toUTCString().slice(17, 22),
      endTime: info.event._instance?.range.end.toUTCString().slice(17, 22),
      onDevice: info.event._def.extendedProps.onDevice,
      description: info.event._def.extendedProps.description,
      uploader: info.event._def.extendedProps.uploader,
    };
    showInfo.value = true;
  },
});

const setEvent = () => {
  postersView.value = [];
  const currentDevice = posters.value.filter(
    (e) => e.MACaddress === selectedDevice.value
  );
  currentDevice.forEach((e) => {
    const allDay =
      e.startTime.toTimeString().includes("00:00") &&
      e.endTime.toTimeString().includes("23:59");
    const exist = postersView.value.find((p) => p.title === e.title);
    const start = e.startDate.toDateString();
    const end = e.endDate.toDateString();
    const endPlus1 = new Date(
      e.endDate.getFullYear(),
      e.endDate.getMonth(),
      e.endDate.getDate() + 1,
      e.endDate.getHours(),
      e.endDate.getMinutes()
    );

    let schedule = null;
    // oneDay allTime
    if (allDay && start === end) {
      schedule = {
        start: e.startDate,
        end: e.endDate,
        oneDay: true,
      };
    }
    // allTime manyDay
    else if (allDay && start !== end) {
      schedule = {
        start: e.startDate,
        end: endPlus1,
      };
    }
    // manyDay
    else {
      schedule = {
        startRecur: e.startDate,
        endRecur: endPlus1,
        startTime: e.startTime.toTimeString(),
        endTime: e.endTime.toTimeString(),
      };
    }

    const posterOnDevice = posters.value
      .filter((p) => p.title === e.title)
      .reduce((arr: any[], cur: any) => {
        const curDevice = store.getters.getDeviceByMac(cur.MACaddress);
        if (!arr.includes(curDevice)) arr.push(curDevice);
        return arr;
      }, []);

    postersView.value.push({
      allDay: allDay,
      title: e.title,
      description: e.description,
      uploader: e.uploader,
      onDevice: posterOnDevice,
      backgroundColor: exist
        ? exist.backgroundColor
        : color.at(postersView.value.length),
      ...schedule,
    });
  });
  calOptions.events = postersView.value;
  calendar.value?.removeAllEvents();
  calendar.value?.addEventSource(postersView.value);
};

onMounted(async () => {
  if (!posters.value.length) {
    store.state.loading = true;
    const res = await getPoster("");
    if (res.ok) {
      res.poster.forEach((e: any) => {
        e.createdAt = new Date(e.createdAt);
        e.updatedAt = new Date(e.updatedAt);
        e.startDate = new Date(e.startDate);
        e.endDate = new Date(e.endDate);
        e.startTime = new Date(e.startTime);
        e.endTime = new Date(e.endTime);
        const users = store.getters.getUserById(e.id);
        const uploader = `${users.firstName} ${
          users?.lastName?.charAt(0) || ""
        }.`;
        e.uploader = uploader;
      });
      store.state.posters = res.poster;
    }
    store.state.loading = false;
  }
  setEvent();
  calendar.value = new Calendar(fullCalendar.value, calOptions);
  calendar.value.render();
  store.state.currentViewDate = calendar.value.view.title;

  document
    .getElementById("sideBarButton")!
    .addEventListener("click", function () {
      setTimeout(() => {
        calendar.value?.updateSize();
      }, 290);
    });

  document.getElementById("prev")!.addEventListener("click", function () {
    calendar.value?.prev();
    store.state.currentViewDate = calendar.value?.view.title || "";
  });

  document.getElementById("next")!.addEventListener("click", function () {
    calendar.value?.next();
    store.state.currentViewDate = calendar.value?.view.title || "";
  });

  document.getElementById("today")!.addEventListener("click", function () {
    calendar.value?.today();
    store.state.currentViewDate = calendar.value?.view.title || "";
  });

  document.getElementById("dayView")!.addEventListener("click", function () {
    calendar.value?.changeView("timeGridDay");
    store.state.currentViewDate = calendar.value?.view.title || "";
  });

  document.getElementById("monthView")!.addEventListener("click", function () {
    calendar.value?.changeView("dayGridMonth");
    store.state.currentViewDate = calendar.value?.view.title || "";
  });
});

onUpdated(() => {
  calendar.value?.updateSize();
});

watch([selectedDevice, posters], () => {
  setEvent();
});
</script>

<template>
  <Skeleton
    v-if="loading"
    width="100%"
    height="92%"
    class="bg-gray-200 -mb-3"
  ></Skeleton>
  <div ref="fullCalendar" class="m-3 font-sf-pro"></div>
  <Dialog
    v-model:visible="showInfo"
    modal
    :draggable="false"
    class="w-72 z-[100]"
  >
    <template #header>
      <div
        class="font-sf-pro font-bold text-2xl inline-flex gap-3 items-center"
      >
        <i
          class="pi pi-circle-fill"
          :style="{ color: selectedEvent.color }"
        ></i>
        <p>{{ selectedEvent.title }}</p>
      </div>
    </template>
    <div class="flex justify-between">
      <div class="text-left">
        <p>Start Date</p>
        <p>End Date</p>
        <p>Time</p>
        <p>Device</p>
        <p>Description</p>
        <p>Uploader</p>
      </div>
      <div class="text-right">
        <p>{{ selectedEvent.start }}</p>
        <p>{{ selectedEvent.end }}</p>
        <p v-if="selectedEvent.allDay">All Day</p>
        <p v-else>
          {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
        </p>
        <div class="inline-flex gap-1">
          <p v-for="(item, index) in selectedEvent.onDevice" :key="index">
            <span>{{ item }}</span>
            <span v-if="index + 1 < selectedEvent.onDevice.length"> |</span>
          </p>
        </div>
        <p>{{ selectedEvent.description }}</p>
        <p v-if="!selectedEvent.description">-</p>
        <p>{{ selectedEvent.uploader }}</p>
      </div>
    </div>
  </Dialog>
</template>

<style>
.fc .fc-popover {
  z-index: 50;
}

.fc-col-header,
.fc-scrollgrid-sync-table,
.fc-timegrid-body,
.fc-timegrid-body table,
.fc-daygrid-body,
.fc-daygrid-body-balanced {
  width: 100% !important;
}

.fc-event {
  cursor: pointer;
  border: 0;
}
.fc-day-sun,
.fc-day-sat {
  background-color: #ffebeb;
}
</style>

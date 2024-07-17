<script lang="ts">
import { defineComponent } from "vue";
import { Poster } from "@/types";
export default defineComponent({
  name: "DashboardView",
});
</script>
<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  computed,
  onUpdated,
} from "vue";
import { color, dateFormatter } from "@/utils/constant";
import store from "@/store";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalInfoContent from "@/components/Modal/ModalInfoContent.vue";

const loadPoster = ref(false);
const showInfo = ref(false);
const selectedEvent = ref<any>(null);
const fullCalendar = ref<any>(null);
const calendar = ref<Calendar>();
const selectedDevice = computed(() => store.state.selectDevice);
const posters = computed(() => store.state.posters);
const postersView = ref<any[]>([]);
let isNext = true; // Default direction
const calOptions = reactive<CalendarOptions>({
  timeZone: "Asia/Bangkok",
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  dayMaxEventRows: true,
  fixedWeekCount: false,
  headerToolbar: false,
  contentHeight: innerHeight,
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
    const end = info.event._def.recurringDef?.typeData.endRecur;
    const startMinus1 = start ? start : null;
    const endMinus1 = end
      ? end
      : info.event.end && info.event.allDay
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
      type: info.event._def.extendedProps.type,
      posterId: info.event._def.extendedProps.posterId,
      title: info.event.title,
      start: dateFormatter(startMinus1 || info.event.start),
      end: dateFormatter(endMinus1 || info.event.start),
      allDay: info.event.allDay,
      startTime: info.event._instance?.range.start.toUTCString().slice(17, 22),
      endTime: info.event._instance?.range.end.toUTCString().slice(17, 22),
      duration: info.event._def.extendedProps.displayDuration,
      onDevice: info.event._def.extendedProps.onDevice,
      description: info.event._def.extendedProps.description,
      image: [{ image: info.event._def.extendedProps.image }],
      uploader: info.event._def.extendedProps.uploader,
      userId: info.event._def.extendedProps.userId,
      amount: info.event._def.extendedProps.amount,
    };
    showInfo.value = true;
  },
  select: function (info) {
    alert("selected " + info.startStr + " to " + info.endStr);
  },
  dateClick: function (info) {
    if (".fc-daygrid-day-number".includes(info.jsEvent.target as any)) {
      calendar.value?.gotoDate(info.date);
      info.view.calendar.changeView("timeGridDay");
      store.state.currentViewDate = info.view.title;
      store.state.viewType = false;
    }
  },
  datesSet: function () {
    const viewHarness = document.querySelector(".fc-view-harness");
    const enterClass = isNext
      ? "calendar-transition-enter-right"
      : "calendar-transition-enter-left";
    const activeClass = isNext
      ? "calendar-transition-enter-right-active"
      : "calendar-transition-enter-left-active";

    viewHarness?.classList.add(enterClass);
    setTimeout(() => {
      viewHarness?.classList.add(activeClass);
    }, 10);
    setTimeout(() => {
      viewHarness?.classList.remove(enterClass, activeClass);
    }, 310);
  },
});

const setEvent = () => {
  if (posters.value && posters.value.length) {
    postersView.value = [];
    const currentDevice = posters.value.filter(
      (e) => e.MACaddress === selectedDevice.value
    );
    currentDevice.forEach((e) => {
      const displayDuration = e.image.length * e.duration;

      const allDay =
        e.startTime.getHours() === 0 &&
        e.endTime.getHours() === 23 &&
        e.endTime.getMinutes() === 59;
      const exist = postersView.value.find((p) => p.title === e.title);

      const endPlus1 = new Date(
        e.endDate.getFullYear(),
        e.endDate.getMonth(),
        e.endDate.getDate() + 1,
        e.endDate.getHours(),
        e.endDate.getMinutes()
      );

      let schedule = null;
      // oneDay allTime
      if (allDay && e.startDate.getTime() === e.endDate.getTime()) {
        schedule = {
          start: e.startDate,
          end: e.endDate,
          oneDay: true,
        };
      }
      // oneDay oneTime
      else if (e.startDate.getTime() === e.endDate.getTime()) {
        schedule = {
          start: new Date(
            e.startDate.getFullYear(),
            e.startDate.getMonth(),
            e.startDate.getDate(),
            e.startTime.getHours() + 7,
            e.startTime.getMinutes()
          ),
          end: new Date(
            e.endDate.getFullYear(),
            e.endDate.getMonth(),
            e.endDate.getDate(),
            e.endTime.getHours() + 7,
            e.endTime.getMinutes()
          ),
        };
      }
      // allTime manyDay
      else if (allDay && e.startDate.getTime() !== e.endDate.getTime()) {
        schedule = {
          start: e.startDate,
          end: endPlus1,
          allDay: true,
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

      const posterOnDevice = posters.value
        ? posters.value
            .filter((p: Poster) => p.title === e.title)
            .reduce((arr: any[], cur: any) => {
              const curDevice = store.getters.getDeviceByMac(cur.MACaddress);
              if (!arr.includes(curDevice)) arr.push(curDevice);
              return arr;
            }, [])
        : [];

      postersView.value.push({
        allDay: allDay,
        type: e.type,
        posterId: e.posterId,
        title: e.title,
        description: e.description,
        image: e.image[0].image,
        displayDuration: displayDuration,
        uploader: e.uploader,
        userId: e.id,
        amount: e.image.length,
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
  }
};

const resizeCalendar = () => {
  setTimeout(() => {
    calendar.value?.updateSize();
  }, 290);
};
const prevMonth = () => {
  isNext = false;
  calendar.value?.prev();
  store.state.currentViewDate = calendar.value?.view.title || "";
};
const nextMonth = () => {
  isNext = true;
  calendar.value?.next();
  store.state.currentViewDate = calendar.value?.view.title || "";
};
const goToday = () => {
  calendar.value?.today();
  store.state.currentViewDate = calendar.value?.view.title || "";
};
const dayView = () => {
  calendar.value?.changeView("timeGridDay");
  store.state.currentViewDate = calendar.value?.view.title || "";
  store.state.viewType = false;
};
const monthView = () => {
  calendar.value?.changeView("dayGridMonth");
  store.state.currentViewDate = calendar.value?.view.title || "";
  store.state.viewType = true;
};

onMounted(async () => {
  if (!posters.value) loadPoster.value = true;
  else setEvent();
  if (fullCalendar.value) {
    calendar.value = new Calendar(fullCalendar.value, calOptions);
    calendar.value.render();
    store.state.currentViewDate = calendar.value.view.title;

    document
      .getElementById("sideBarButton")
      ?.addEventListener("click", resizeCalendar);
    document.getElementById("prev")?.addEventListener("click", prevMonth);
    document.getElementById("next")?.addEventListener("click", nextMonth);
    document.getElementById("today")?.addEventListener("click", goToday);
    document.getElementById("dayView")?.addEventListener("click", dayView);
    document.getElementById("monthView")?.addEventListener("click", monthView);
  }
});

onUpdated(() => {
  calendar.value?.updateSize();
});

watch(
  [selectedDevice, posters],
  () => {
    if (posters.value) loadPoster.value = false;
    setEvent();
  },
  { deep: true }
);

onUnmounted(() => {
  removeEventListener("click", resizeCalendar);
  removeEventListener("click", prevMonth);
  removeEventListener("click", nextMonth);
  removeEventListener("click", goToday);
  removeEventListener("click", dayView);
  removeEventListener("click", monthView);
  calendar.value?.destroy();
});

const closeModalInfoContent = () => {
  showInfo.value = false;
};
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loadPoster"
      class="bg-gray-200 rounded-xl flex-1"
    ></Skeleton>
    <div v-show="!loadPoster" ref="fullCalendar"></div>
  </div>
  <ModalInfoContent
    :show="showInfo"
    :data="selectedEvent"
    :onClose="closeModalInfoContent"
    :haveAction="true"
  />
</template>

<style scoped>
.rectangle {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0;
}
</style>
<style>
.posterDetail {
  display: inline-flex;
  gap: 6px;
}
.fc {
  overflow: hidden;
}
.fc .fc-popover {
  z-index: 10;
}

.fc-col-header-cell {
  font-size: 13px;
}
.fc-scrollgrid-sync-table,
.fc-timegrid-body,
.fc-timegrid-body table,
.fc-daygrid-body,
.fc-daygrid-body-balanced {
  width: 100% !important;
  font-size: 13px;
  font-weight: 800;
  color: #575757;
  border-radius: 0%;
}

.fc-event {
  cursor: pointer;
  border: 0;
}
.fc-day-sun,
.fc-day-sat {
  background-color: #f3f3f3 !important;
}

.fc-day-today {
  background-color: #ffffff !important;
}

.fc .fc-daygrid-day-number {
  margin: 5px;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc-day-today .fc-daygrid-day-number {
  background-color: #3889f2 !important;
  color: #fff !important;
}

.fc .fc-daygrid-day-number:hover {
  background-color: #d1d5db;
  cursor: pointer;
}

.calendar-transition-enter-right {
  opacity: 0;
  transform: translateX(100%);
}
.calendar-transition-enter-right-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.calendar-transition-enter-left {
  opacity: 0;
  transform: translateX(-100%);
}
.calendar-transition-enter-left-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.calendar-transition-leave {
  opacity: 1;
  transform: translateX(0);
}
.calendar-transition-leave-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
</style>

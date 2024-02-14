<script lang="ts">
import { defineComponent } from "vue";
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
import { color, dateFormatter, day, setFieldPoster } from "@/utils/constant";
import store from "@/store";
import { getPoster } from "@/services";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PopupUpload from "@/components/PopupUploadCompo.vue";

const loadPoster = ref(false);
const showInfo = ref(false);
const selectedEvent = ref<any>(null);
const fullCalendar = ref<any>(null);
const calendar = ref<Calendar>();
const selectedDevice = computed(() => store.state.selectDevice);
const posters = computed(() => store.state.posters);
const postersView = ref<any[]>([]);
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
      type: info.event._def.extendedProps.type,
      title: info.event.title,
      start: dateFormatter(start || info.event.start),
      end: dateFormatter(endMinus1 || info.event.start),
      allDay: info.event.allDay,
      startTime: info.event._instance?.range.start.toUTCString().slice(17, 22),
      endTime: info.event._instance?.range.end.toUTCString().slice(17, 22),
      duration: info.event._def.extendedProps.displayDuration,
      onDevice: info.event._def.extendedProps.onDevice,
      description: info.event._def.extendedProps.description,
      uploader: info.event._def.extendedProps.uploader,
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
});

const setEvent = () => {
  postersView.value = [];
  const currentDevice = posters.value.filter(
    (e) => e.MACaddress === selectedDevice.value
  );
  currentDevice.forEach((e) => {
    const numPoster = e.image.length;
    const displayDuration = numPoster * e.duration;
    if (numPoster > 1) {
      e.type = "Collection";
    } else e.type = "Individual";

    if (postersView.value.find((p) => p.title === e.title)) return;

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
      type: e.type,
      title: e.title,
      description: e.description,
      displayDuration: displayDuration,
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

const resizeCalendar = () => {
  setTimeout(() => {
    calendar.value?.updateSize();
  }, 290);
};
const prevMonth = () => {
  calendar.value?.prev();
  store.state.currentViewDate = calendar.value?.view.title || "";
};
const nextMonth = () => {
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
  if (!posters.value.length) loadPoster.value = true;
  setEvent();
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

watch([selectedDevice, posters], () => {
  if (posters.value.length) loadPoster.value = false;
  setEvent();
});

onUnmounted(() => {
  removeEventListener("click", resizeCalendar);
  removeEventListener("click", prevMonth);
  removeEventListener("click", nextMonth);
  removeEventListener("click", goToday);
  removeEventListener("click", dayView);
  removeEventListener("click", monthView);
  calendar.value?.destroy();
});
</script>

<template>
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loadPoster"
      class="bg-gray-200 rounded-xl flex-1"
    ></Skeleton>
    <div v-show="!loadPoster" ref="fullCalendar"></div>
    <PopupUpload />
    <Dialog
      v-model:visible="showInfo"
      modal
      :draggable="false"
      class="w-[500px] z-[100]"
    >
      <template #header>
        <div class="inline-flex justify-between items-center w-full">
          <div class="inline-flex font-bold text-2xl gap-3 items-center">
            <i
              class="pi pi-circle-fill"
              :style="{ color: selectedEvent.color }"
            ></i>
            <p>{{ selectedEvent.title }}</p>
            <p>({{ selectedEvent.type }})</p>
          </div>
          <div class="inline-flex gap-5 mr-5">
            <i class="pi pi-trash"></i>
            <i class="pi pi-pencil"></i>
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <!-- Start Date -->
        <div class="posterDetail">
          <p>Start Date</p>
          <p>{{ selectedEvent.start }}</p>
        </div>
        <!-- End Date -->
        <div class="posterDetail">
          <p>End Date</p>
          <p>{{ selectedEvent.end }}</p>
        </div>
        <!-- Running Time -->
        <div class="posterDetail">
          <p>Running Time</p>
          <p v-if="selectedEvent.allDay">All Day</p>
          <p v-else>
            {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
          </p>
        </div>
        <!-- Duration -->
        <div class="posterDetail">
          <p>Display Duration</p>
          <p>{{ selectedEvent.duration }} sec</p>
        </div>
        <!-- Device -->
        <div class="posterDetail">
          <p>Device</p>
          <div class="flex flex-col">
            <p
              v-for="(item, index) in selectedEvent.onDevice"
              :key="index"
              class="inline-flex justify-between gap-1"
            >
              <span>{{ item }}</span>
              <span>
                ({{
                  store.state.devices.find((e) => e.deviceName === item)?.room
                }})
              </span>
            </p>
          </div>
        </div>
        <!-- Description -->
        <div class="posterDetail">
          <p>Description</p>
          <p>{{ selectedEvent.description }}</p>
          <p v-if="!selectedEvent.description">-</p>
        </div>
        <!-- Uploader -->
        <div class="posterDetail">
          <p>Uploader</p>
          <p>{{ selectedEvent.uploader }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.rectangle {
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  overflow: hidden;
}
</style>
<style>
.posterDetail {
  display: inline-flex;
  justify-content: space-between;
}
.fc {
  border: 1px solid #a2a2a2;
  border-radius: 15px;
  overflow: hidden;
}
.fc .fc-popover {
  z-index: 10;
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
.fc-day-sat,
.fc-day-today {
  background-color: #f3f3f3 !important;
}

.fc .fc-daygrid-day-number {
  margin: 2px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc-day-today .fc-daygrid-day-number {
  background-color: #039be5 !important;
  color: #fff !important;
}

.fc .fc-daygrid-day-number:hover {
  background-color: #d1d5db;
  cursor: pointer;
}
</style>

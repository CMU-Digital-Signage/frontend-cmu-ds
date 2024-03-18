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
import { color, dateFormatter, setNorForm } from "@/utils/constant";
import store from "@/store";
import { deletePoster } from "@/services";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const user = computed(() => store.state.userInfo);
const loadPoster = ref(false);
const showInfo = ref(false);
const selectedEvent = ref<any>(null);
const fullCalendar = ref<any>(null);
const calendar = ref<Calendar>();
const selectedDevice = computed(() => store.state.selectDevice);
const posters = computed(() => store.state.posters);
const postersView = ref<any[]>([]);
const deletePopup = ref(false);
const loading = ref(false);
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
});

const setEvent = () => {
  if (posters.value && posters.value.length) {
    postersView.value = [];
    const currentDevice = posters.value.filter(
      (e) => e.MACaddress === selectedDevice.value
    );
    currentDevice.forEach((e) => {
      const displayDuration = e.image.length * e.duration;
      if (e.image.length > 1) {
        e.type = "Collection";
      } else e.type = "Individual";

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

const del = async (posterId: string) => {
  const res = await deletePoster(posterId);
  loading.value = true;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Delete Poster successful.",
    life: 3000,
  });
  loading.value = false;
  showInfo.value = false;
  deletePopup.value = false;
};
</script>

<template>
  <div class="rectangle flex flex-col">
    <Toast />
    <Skeleton
      v-if="loadPoster"
      class="bg-gray-200 rounded-xl flex-1"
    ></Skeleton>
    <Dialog
      :closable="!loading"
      v-model:visible="deletePopup"
      modal
      close-on-escape
      :draggable="false"
      class="w-[425px]"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
        },
        mask: {
          style:
            'backdrop-filter:  brightness(50%) grayscale(100%) contrast(150%) blur(3px)',
        },
      }"
    >
      <template #header>
        <div class="header-popup">
          Delete
          {{
            selectedEvent?.posterId
              ? `"${selectedEvent.title}" Poster`
              : `"${selectedEvent?.incidentName}" Emergency Poster`
          }}?
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <div>
          Deleting this poster or collection will be permenently deleted from
          all devices.
        </div>
        <div class="inline-block">
          <div class="flex flex-row gap-4 pt-3">
            <Button
              text
              label="Cancel"
              :loading="loading"
              @click="deletePopup = false"
              :class="'secondaryButton'"
            ></Button>
            <Button
              :loading="loading"
              label="Delete Poster"
              :class="'primaryButtonDel'"
              type="submit"
              @click="del(selectedEvent.posterId)"
            ></Button>
          </div>
        </div>
      </div>
    </Dialog>
    <div v-show="!loadPoster" ref="fullCalendar"></div>
    <Dialog
      v-model:visible="showInfo"
      modal
      :draggable="false"
      class="w-[550px] z-[100]"
    >
      <template #header>
        <div class="inline-flex justify-between items-center w-full">
          <div class="inline-flex font-bold text-2xl gap-3 items-start">
            <i
              class="pi pi-circle-fill mt-2"
              :style="{ color: selectedEvent.color }"
            ></i>
            <div class="flex flex-col">
              <p>{{ selectedEvent.title }}</p>
              <p class="text-[16px] text-[#8d8d8d] -mt-1">
                {{ selectedEvent.type }}
              </p>
            </div>
          </div>
          <div
            v-if="user.isAdmin || user.id === selectedEvent.userId"
            class="inline-flex gap-5 mr-5"
          >
            <i
              class="pi pi-pencil cursor-pointer rounded-full p-2 hover:bg-gray-200"
              @click="
                setNorForm(selectedEvent);
                showInfo = false;
              "
            ></i>
            <i
              class="pi pi-trash cursor-pointer rounded-full p-2 hover:bg-gray-200"
              @click="deletePopup = true"
            ></i>
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <!-- Number of Poster -->
        <div class="posterDetail">
          <p>Number of Poster</p>
          <p>
            {{ selectedEvent.amount }}
            {{ selectedEvent.amount > 1 ? "Posters" : "Poster" }}
          </p>
        </div>
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
                  store.state.devices?.find((e) => e.deviceName === item)?.room
                }})
              </span>
            </p>
          </div>
        </div>
        <!-- Uploader -->
        <div class="posterDetail">
          <p>Uploader</p>
          <p>{{ selectedEvent.uploader }}</p>
        </div>

        <!-- Description -->
        <div class="posterDetail flex-col gap-1">
          <p class="font-[800px] text-[#535353]">Description</p>
          <div class="bg-[#e9f2fd] rounded-lg p-3 px-5">
            <p class="font-notoThai">{{ selectedEvent.description }}</p>
            <p v-if="!selectedEvent.description">-</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.rectangle {
  width: 100%;
  height: 100%;
  padding-inline: 1rem;
  overflow: hidden;
  padding-top: 0.75rem;
  padding-bottom: 2rem;
}

.header-popup {
  font-weight: 700;
  font-size: 22px;
  color: rgb(255, 0, 0);
}

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
}

.primaryButtonDel:hover {
  background-color: rgb(193, 0, 0);
  text-decoration-line: underline;
}

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: none;
  color: black;
  cursor: pointer;
  margin-right: 10px;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}
</style>
<style>
.posterDetail {
  display: inline-flex;
  justify-content: space-between;
}
.fc {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
.fc-day-sat {
  background-color: #f3f3f3 !important;
}

.fc-day-today {
  background-color: #ffffff !important;
}

.fc .fc-daygrid-day-number {
  margin: 5px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc-day-today .fc-daygrid-day-number {
  background-color: #e50356 !important;
  color: #fff !important;
}

.fc .fc-daygrid-day-number:hover {
  background-color: #d1d5db;
  cursor: pointer;
}
</style>

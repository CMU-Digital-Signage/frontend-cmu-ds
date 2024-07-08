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
  <Toast />
  <div class="rectangle flex flex-col">
    <Skeleton
      v-if="loadPoster"
      class="bg-gray-200 rounded-xl flex-1"
    ></Skeleton>
    <div v-show="!loadPoster" ref="fullCalendar"></div>
  </div>
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
        style: 'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
      }
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
    <div class="flex flex-col gap-2 text-[14px]">
      <div>
        Deleting this poster or collection will be permenently deleted from all
        devices.
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
            icon="pi pi-trash" 
                :class="'primaryButtonDel justify-center'" 
                :pt="{ label: { class: 'flex-none ml-2' } }"
            type="submit"
            @click="del(selectedEvent.posterId)"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="showInfo"
    close
    modal
    :draggable="false"
    class="w-[400px] z-[100]"
    :pt="{
      header: {
        class: 'items-start rounded-t-lg  pt-3',
      },
      content: {
        class: 'px-5 pb-5 rounded-b-lg',
      },
    }"
  >
    <template #header>
      <div class="flex flex-col w-full">
        <div
          v-if="user.isAdmin || user.id === selectedEvent.userId"
          class="inline-flex gap-3 justify-end mr-[12px] mb-2"
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

        <div class="inline-flex font-normal text-[22px] gap-3">
          <i
            class="pi pi-circle-fill mt-2"
            :style="{ color: selectedEvent.color }"
          ></i>
          <div class="flex flex-col">
            <p>{{ selectedEvent.title }}</p>
            <!-- Start Date to End Date -->
            <p class="text-[14px] font-thin text-[#575757]">
              <span
                >{{ dateFormatter(new Date(selectedEvent.start), 3) }} -
              </span>
              <span>{{ dateFormatter(new Date(selectedEvent.end), 3) }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col text-[14px] gap-1 ml-4">
      <!-- Number of Poster -->
      <div class="posterDetail flex-row gap-">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-collection-play"
          viewBox="0 0 30 32"
        >
          <path
            d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1m2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848z"
          />
          <path
            d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5z"
          />
        </svg>
        <p>
          {{ selectedEvent.amount }}
          {{ selectedEvent.amount > 1 ? "Posters" : "Poster" }}
        </p>
      </div>
      <!-- Running Time -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-clock"
          viewBox="0 0 30 32"
        >
          <path
            d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
          />
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
          />
        </svg>
        <p v-if="selectedEvent.allDay">All-day</p>
        <p v-else>
          {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
        </p>
      </div>
      <!-- Duration -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-play-circle"
          viewBox="0 0 30 32"
        >
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
          />
          <path
            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"
          />
        </svg>
        <div class="mt-[2px]">
          <p>{{ selectedEvent.duration }} sec</p>
        </div>
      </div>
      <!-- Device -->
      <div class="posterDetail flex-row gap-1 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-display"
          viewBox="0 0 30 32"
        >
          <path
            d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"
          />
        </svg>
        <div class="mt-[2px]">
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
      </div>

      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-person-add"
          viewBox="0 0 30 32"
        >
          <path
            d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
          />
          <path
            d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"
          />
        </svg>

        <div class="mt-[2px]">
          <p>{{ selectedEvent.uploader }}</p>
        </div>
      </div>

      <!-- Description -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-text-paragraph"
          viewBox="0 0 30 32"
        >
          <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5"
          />
        </svg>
        <div class="mt-[2px]">
          <p>{{ selectedEvent.description }}</p>
          <p v-if="!selectedEvent.description">-</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.rectangle {
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 0;
}

.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: rgb(255, 91, 91);
}

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  background-color: white;
  color: rgb(255, 91, 91);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}

.primaryButtonDel:hover {
  background-color: rgb(255, 235, 235);
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
  font-size: 14px;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
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

.fc-col-header-cell
{
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
</style>

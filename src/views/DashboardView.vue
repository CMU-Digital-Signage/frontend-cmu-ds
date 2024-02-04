<script lang="ts">
import { defineComponent } from "vue";
import { getPoster } from "@/services";
import { color, customDateFormatter } from "@/utils/constant";
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
      };
    }
    // oneDay
    else if (!allDay && start === end) {
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

    postersView.value.push({
      allDay: allDay,
      display: "block",
      title: e.title,
      uploader: e.uploader,
      backgroundColor: exist
        ? exist.backgroundColor
        : color.at(postersView.value.length),
      ...schedule,
    });
  });
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
      //uploader
      const users = store.getters.getUserById(e.id);
      const uploader = `${users.firstName} ${
        users?.lastName?.charAt(0) || ""
      }.`;
      e.uploader = uploader;
    });
    store.commit("setPosters", res.poster);
    setEvent();
  }
  calendar.value = new Calendar(calendarEl.value!, {
    timeZone: "Asia/Bangkok",
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: "dayGridMonth",
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 6,
      },
    },
    fixedWeekCount: false,
    headerToolbar: false,
    height: innerHeight * 0.9,
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
    // slotMinTime: '00:00:00',
    // slotMaxTime: '24:00:00',
    eventClick: function (info) {
      console.log(info.event);

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
            info.event.end.getDate() - 1,
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
        startTime: info.event._instance?.range.start
          .toUTCString()
          .slice(17, 22),
        endTime: info.event._instance?.range.end.toUTCString().slice(17, 22),
        uploader: info.event._def.extendedProps.uploader,
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
  <div ref="calendarEl" class="m-3 font-sf-pro"></div>
  <Dialog v-model:visible="showInfo" modal :draggable="false" class="w-72">
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
        <p>Uploader</p>
      </div>
      <div class="text-right">
        <p>{{ selectedEvent.start }}</p>
        <p>{{ selectedEvent.end }}</p>
        <p v-if="selectedEvent.allDay">All Day</p>
        <p v-else>
          {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
        </p>
        <p>{{ selectedEvent.uploader }}</p>
      </div>
    </div>
  </Dialog>
</template>

<style></style>

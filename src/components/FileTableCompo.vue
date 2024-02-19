<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FileTableCompo",
});
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, watch, computed, onMounted } from "vue";
import store from "@/store";
import router from "@/router";
import {
  dateFormatter,
  newInitialFormDisplay,
  statusEmer,
} from "@/utils/constant";
import { Display, Poster, User } from "@/types";
import { statusPoster } from "@/utils/constant";
import { deletePoster, deleteEmergency } from "@/services";
import { useToast } from "primevue/usetoast";

const isOverlayPanelVisible = ref();
const toggleShowStatus = (e: any) => {
  isOverlayPanelVisible.value.toggle(e);
};
const calculateScreenHeight = () => {
  const screenHeight = window.innerHeight;
  const multiplier = 0.69;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
};
const loading = computed({
  get: () => store.state.loading,
  set: (val) => (store.state.loading = val),
});
const props = defineProps({ types: String });
const filterInput = computed(() => store.state.filterInputPosters);
const emerPosters = computed(() =>
  store.state.emerPosters.filter((e) => {
    return (
      (!filterInput.value.title ||
        e.incidentName
          .toLowerCase()
          .includes(filterInput.value.title.toLowerCase())) &&
      (!filterInput.value.status || e.status === filterInput.value.status)
    );
  })
);
const uniquePosters = computed(() =>
  store.state.uniquePosters.filter((e) => {
    return (
      (!filterInput.value.title ||
        e.title
          .toLowerCase()
          .includes(filterInput.value.title.toLowerCase())) &&
      (!filterInput.value.uploader.toLowerCase() ||
        e.uploader
          .toLowerCase()
          .includes(filterInput.value.uploader.toLowerCase())) &&
      (!filterInput.value.uploadDate ||
        dateFormatter(e.createdAt) ===
          dateFormatter(filterInput.value.uploadDate)) &&
      (!filterInput.value.status || e.status === filterInput.value.status)
    );
  })
);
const formDisplay = computed(() => store.state.formDisplay);
const user = computed<User>(() => store.state.userInfo);
const toast = useToast();
let delP = null as any;

const setForm = (data: any) => {
  if (props.types === "NP") {
    store.state.editPoster.title = data.title;
    const poster = store.state.posters.filter((e) => e.title === data.title);
    // poster form
    const form = {
      posterId: data.posterId,
      title: data.title,
      description: poster[0].description,
      image: [...poster[0].image],
    } as Poster;
    store.state.formPoster = { ...form };

    // display form
    store.state.formDisplay.pop();
    poster.forEach((e: any) => {
      const index = formDisplay.value.findIndex(
        (disp) => disp.startDate === e.startDate && disp.endDate === e.endDate
      );

      if (index === -1) {
        const last = formDisplay.value.length;
        store.state.formDisplay.push(newInitialFormDisplay());
        store.state.formDisplay[last].startDate = e.startDate;
        store.state.formDisplay[last].endDate = e.endDate;
        store.state.formDisplay[last].duration = e.duration;
        store.state.formDisplay[last].MACaddress.push(e.MACaddress);
        if (
          e.startTime.toTimeString().includes("00:00") &&
          e.endTime.toTimeString().includes("23:59")
        ) {
          store.state.formDisplay[last].allDay = true;
        } else {
          store.state.formDisplay[last].time.pop();
          store.state.formDisplay[last].time.push({
            startTime: e.startTime,
            endTime: e.endTime,
          });
        }
      } else {
        if (!store.state.formDisplay[index].MACaddress.includes(e.MACaddress)) {
          store.state.formDisplay[index].MACaddress.push(e.MACaddress);
        }
        if (
          !store.state.formDisplay[index].time.includes({
            startTime: e.startTime,
            endTime: e.endTime,
          })
        ) {
          store.state.formDisplay[index].time.push({
            startTime: e.startTime,
            endTime: e.endTime,
          });
        }
      }
    });

    formDisplay.value.forEach((e) => {
      if (e.MACaddress.length === store.state.devices.length) {
        e.MACaddress = [];
        e.allDevice = true;
      }
    });

    console.log(formDisplay.value);
  } else {
    store.state.editPoster.title = data.incidentName;
    store.state.formEmer = {
      ...data,
      status: data.status === "Active" ? true : false,
    };
  }
  store.state.editPoster.type = props.types || "";
  store.state.showUpload = true;
};

const del = async (poster: string) => {
  delP = poster;
  store.state.loading = true;
  if (props.types == "NP") {
    const res = await deletePoster(delP);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete Poster successful.",
      life: 3000,
    });
  } else {
    const res = await deleteEmergency(delP);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete Emergency successful.",
      life: 3000,
    });
  }
  store.state.loading = false;
  delP = null;
};
</script>

<template>
  <DataTable
    :value="props.types === 'NP' ? uniquePosters : emerPosters"
    scrollDirection="vertical"
    scrollable
    :scrollHeight="calculateScreenHeight()"
    class="mt-2 text-[14px] lg:text-[16px]"
  >
    <Column
      :field="(e) => (props.types === 'NP' ? e.title : e.incidentName)"
      header="Title"
      sortable
      :class="`${props.types === 'NP' ? 'w-1/5' : 'w-1/3'}`"
    >
      <template #sorticon="slotProps">
        <i
          class="m-3 pi"
          :class="{
            'pi-sort-alt': slotProps.sortOrder === 0,
            'pi-sort-alpha-down': slotProps.sortOrder === 1,
            'pi-sort-alpha-up': slotProps.sortOrder === -1,
          }"
        ></i>
      </template>
    </Column>
    <Column
      v-if="user?.isAdmin && props.types === 'NP'"
      field="uploader"
      header="Uploader"
      sortable
      class="w-1/5"
    >
      <template #sorticon="slotProps">
        <i
          class="m-3 pi"
          :class="{
            'pi-sort-alt': slotProps.sortOrder === 0,
            'pi-sort-alpha-down': slotProps.sortOrder === 1,
            'pi-sort-alpha-up': slotProps.sortOrder === -1,
          }"
        ></i>
      </template>
    </Column>
    <Column
      v-if="props.types === 'NP'"
      :field="(e) => dateFormatter(e.createdAt)"
      header="Upload Date"
      sortable
      class="w-1/5"
    >
      <template #sorticon="slotProps">
        <i
          class="m-3 pi"
          :class="{
            'pi-sort-alt': slotProps.sortOrder === 0,
            'pi-sort-numeric-up': slotProps.sortOrder === 1,
            'pi-sort-numeric-down': slotProps.sortOrder === -1,
          }"
        ></i>
      </template>
    </Column>
    <Column
      field="status"
      :class="`${props.types === 'NP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #header>
        <div>Status</div>
        <i
          v-if="store.state.selectTabview === 0"
          class="pi pi-info-circle cursor-pointer ml-1"
          @mouseover="(e) => toggleShowStatus(e)"
          @mouseleave="(e) => toggleShowStatus(e)"
        ></i>
        <OverlayPanel
          class="w-fit h-fit max-w-full max-h-full p-2 rounded-lg"
          ref="isOverlayPanelVisible"
        >
          <div class="flex flex-col gap-3">
            <div class="inline-flex gap-2">
              <Tag severity="success" value="Displayed" />
              <p class="mt-1">Poster is currently being displayed.</p>
            </div>
            <div class="inline-flex gap-2">
              <Tag severity="danger" value="Expired" />
              <p class="mt-1">
                Posters are no longer scheduled to be displayed.
              </p>
            </div>
            <div class="inline-flex gap-2">
              <Tag severity="info" value="Awaited" />
              <p class="mt-1">
                Poster will be displayed at a later date or time.
              </p>
            </div>
          </div>
        </OverlayPanel>
      </template>

      <template #body="rowData">
        <Tag
          :value="rowData.data.status"
          rounded
          :severity="
            props.types === 'NP'
              ? statusPoster.find((e) => rowData.data.status === e.status)
                  ?.severity
              : statusEmer.find((e) => rowData.data.status === e.status)
                  ?.severity
          "
        />
      </template>
    </Column>

    <Column
      field="management"
      header="Action"
      :class="`${props.types === 'NP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #body="rowData">
        <Button
          icon="pi pi-pencil"
          rounded
          class="w-8 h-8 md:w-9 md:h-9"
          severity="warning"
          @click="
            () => {
              setForm(rowData.data);
            }
          "
        />
        <Button
          icon="pi pi-trash"
          rounded
          class="w-8 h-8 md:w-9 md:h-9 ml-[5px] md:ml-3"
          severity="danger"
          :loading="
            loading &&
            (rowData.data.posterId === delP ||
              rowData.data.incidentName === delP)
          "
          @click="del(rowData.data.posterId || rowData.data.incidentName)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  name: "FileTableCompo",
});
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, watch, computed, onMounted } from "vue";
import store from "@/store";
import { getPoster, deletePoster } from "@/services/poster";
import { createUnique, initialFormDisplay } from "@/utils/constant";
import { Display, User } from "@/types";
import { deleteEmergency, getEmergency } from "@/services";
import { useToast } from "primevue/usetoast";

const props = defineProps({ types: String });
const posters = computed(() => store.state.posters);
const emerPosters = computed(() => store.state.emerPosters);
const uniquePosters = computed(() => store.state.uniquePosters);
const user = computed<User>(() => store.state.userInfo);
const toast = useToast();
let delP = null as any;
const loading = computed(() => store.state.loading);

const setForm = (title: string) => {
  if (props.types === "nor") {
    const data = posters.value.filter((e) => e.title === title);

    // poster form
    const form = {
      title: title,
      image: data[0].image,
      description: data[0].description,
    };
    store.state.formPoster = form;

    // display form
    const display = [{ ...initialFormDisplay }] as Display[];
    data.forEach((e) => {
      display.find((disp) => {
        if (disp.startDate !== e.startDate && disp.endDate !== e.endDate) {
          disp.startDate = e.startDate;
          disp.endDate = e.endDate;
          disp.duration = e.duration;
          if (
            e.startTime.toTimeString().includes("00:00") &&
            e.endTime.toTimeString().includes("23:59")
          ) {
            disp.allDay = true;
          } else {
            display[0].time.pop();
            disp.time.push({ startTime: e.startTime, endTime: e.endTime });
          }
        } else {
          if (
            !disp.time.includes({ startTime: e.startTime, endTime: e.endTime })
          ) {
            disp.time.push({ startTime: e.startTime, endTime: e.endTime });
          }
        }
      });
    });
    console.log(display);

    store.state.formDisplay = display;
  } else {
    const data = emerPosters.value.filter((e) => e.incidentName === title);
    const form = {
      title: title,
      image: data[0].emergencyImage,
      description: data[0].description,
    };
    store.state.formPoster = form;
  }
};

onMounted(async () => {
  if (!posters.value.length || !emerPosters.value.length) {
    if (props.types === "nor") {
      const res = await getPoster();
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
        createUnique(res.poster);
      }
    } else {
      const res = await getEmergency();
      if (res.ok) {
        store.state.emerPosters = res.emergency;
      }
    }
  } else if (!uniquePosters.value.length && props.types == "nor") {
    createUnique(posters.value);
  }
});

const del = async (poster: string) => {
  // delP = poster;
  // store.state.loading = true;
  // if (props.types == "nor") {
  //   const res = await deletePoster(delP);
  //   store.state.posters = posters.value?.filter((e) => e.posterId !== delP);
  //   store.state.uniquePosters = uniquePosters.value?.filter(
  //     (e) => e.posterId !== delP
  //   );
  // } else {
  //   const res = await deleteEmergency(delP);
  //   store.state.emerPosters = emerPosters.value?.filter(
  //     (e) => e.incidentName !== delP
  //   );
  // }
  // store.state.loading = false;
  // delP = null;
  // toast.add({
  //   severity: "success",
  //   summary: "Success",
  //   detail: "Delete poster successful.",
  //   life: 3000,
  // });
};
</script>

<template>
  <div>
    <DataTable
      :value="props.types === 'nor' ? uniquePosters : emerPosters"
      scrollDirection="vertical"
      scrollable
      class="mt-2"
    >
      <Column field="title" header="Title" sortable style="width: 20%"
        ><template #sorticon="slotProps">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': slotProps.sortOrder === 0,
              'pi-sort-alpha-down': slotProps.sortOrder === 1,
              'pi-sort-alpha-up': slotProps.sortOrder === -1,
            }"
          ></i>
        </template>
        <template #body="slotProps">
          <div v-if="props.types === 'emer'">
            {{ slotProps.data.incidentName }}
          </div>
          <div v-else>
            {{ slotProps.data.title }}
          </div>
        </template>
      </Column>
      <Column
        v-if="user?.isAdmin && props.types === 'nor'"
        field="uploader"
        header="Uploader"
        sortable
        style="width: 20%"
        ><template #sorticon="slotProps">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': slotProps.sortOrder === 0,
              'pi-sort-alpha-down': slotProps.sortOrder === 1,
              'pi-sort-alpha-up': slotProps.sortOrder === -1,
            }"
          ></i> </template
      ></Column>
      <Column
        v-if="props.types === 'nor'"
        field="createdAt"
        header="Upload Date"
        sortable
        style="width: 20%"
        ><template #sorticon="slotProps">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': slotProps.sortOrder === 0,
              'pi-sort-numeric-up': slotProps.sortOrder === 1,
              'pi-sort-numeric-down': slotProps.sortOrder === -1,
            }"
          ></i> </template
      ></Column>
      <Column field="status" header="Status" style="width: 15%">
        <template #body="slotProps" v-if="props.types === 'emer'">
          <p>{{ slotProps.data.status ? "Active" : "Inactive" }}</p>
        </template>
      </Column>
      <Column field="management" header="Management" style="width: 15%">
        <template #body="rowData">
          <div v-if="rowData">
            <Button
              icon="pi pi-pencil"
              rounded
              class="w-9 h-9"
              severity="warning"
              @click="
                () => {
                  setForm(rowData.data.title || rowData.data.incidentName);
                  router.push('/editfile');
                }
              "
            />
            <Button
              icon="pi pi-trash"
              rounded
              class="w-9 h-9 mx-3"
              severity="danger"
              :loading="
                loading &&
                (rowData.data.posterId === delP ||
                  rowData.data.incidentName === delP)
              "
              @click="del(rowData.data.posterId || rowData.data.incidentName)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style></style>

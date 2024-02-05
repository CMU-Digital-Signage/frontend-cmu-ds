<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  name: "FileTableCompo",
});
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, computed, onMounted, reactive, onUnmounted } from "vue";
import store from "@/store";
import { getPoster } from "@/services/poster";
import { customDateFormatter, initialFormDisplay } from "@/utils/constant";
import { Display, User } from "@/types";
import { getEmergency } from "@/services";

const props = defineProps({ types: String });

const posters = computed(() => store.state.posters);
const emerPosters = computed(() => store.state.emerPosters);
const uniquePosters = computed(() => store.state.uniquePosters);
const user = computed<User>(() => store.state.userInfo);

const setForm = (title: string) => {
  if (props.types === "nor") {
    const data = posters.value.filter((e) => e.title === title);
    console.log(data);

    const form = {
      title: title,
      image: data[0].image,
      description: data[0].description,
    };
    store.state.formPoster = form;

    const display = [{ ...initialFormDisplay }] as Display[];
    display[0].time.pop();
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

  console.log(title, props.types);
};

const createUnique = (data: any) => {
  const uniqueP = data.reduce((acc: any[], e: any) => {
    // Check if the title is not already in the accumulator
    if (!acc.some((poster) => poster.title === e.title)) {
      //uploader
      const users = store.getters.getUserById(e.id);
      const uploader = `${users.firstName} ${
        users?.lastName?.charAt(0) || ""
      }.`;
      //status
      const currentDate = new Date();
      const startDate = new Date(e.startDate);
      const endDate = new Date(e.endDate);
      const isActive = currentDate >= startDate && currentDate <= endDate;
      //createdAt
      const createdAt = new Date(e.startDate);

      if (user.value.isAdmin) {
        acc.push({
          title: e.title,
          uploader,
          createdAt: customDateFormatter(createdAt),
          status: isActive,
        });
      } else if (e.id == user.value.id) {
        acc.push({
          title: e.title,
          uploader,
          createdAt: customDateFormatter(createdAt),
          status: isActive,
        });
      }
    }
    return acc;
  }, []);
  store.commit("setUniquePosters", uniqueP);
};

onMounted(async () => {
  if (!posters.value.length || !emerPosters.value.length) {
    if (props.types === "nor") {
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

        store.commit("setPosters", res.poster);
        createUnique(res.poster);
      }
    } else {
      const res = await getEmergency();
      if (res.ok) {
        store.commit("setEmerPosters", res.emergency);
      }
    }
  } else if (!uniquePosters.value.length && props.types == "nor") {
    createUnique(posters.value);
  }
});
</script>

<template>
  <div>
    <DataTable
      :value="props.types === 'nor' ? uniquePosters : emerPosters"
      scrollDirection="vertical"
      scrollable
      class="font-sf-pro mt-2"
    >
      <Column field="title" header="Title" sortable style="width: 20%">
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
      ></Column>
      <Column
        v-if="props.types === 'nor'"
        field="createdAt"
        header="Upload Date"
        sortable
        style="width: 20%"
      ></Column>
      <Column field="'status'" header="Status" style="width: 15%">
        <!-- <template #body="slotProps">
          <div v-if="slotProps.data.status">Active</div>
          <div v-else>Inactive</div>
        </template> -->
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
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style></style>

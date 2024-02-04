<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FileTableCompo",
});
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, computed, onMounted } from "vue";
import store from "@/store";
import { getPoster } from "@/services/poster";
import { customDateFormatter } from "@/utils/constant";
import { User } from "@/types";

const posters = computed(() => store.state.posters);
const uniquePosters = computed(() => store.state.uniquePosters);
const user = computed<User>(() => store.state.userInfo);

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
      const status = isActive ? "Active" : "Inactive";
      //createdAt
      const createdAt = new Date(e.startDate);

      if (user.value.isAdmin) {
        acc.push({
          title: e.title,
          uploader,
          createdAt: customDateFormatter(createdAt),
          status,
        });
      } else if (e.id == user.value.id) {
        acc.push({
          title: e.title,
          uploader,
          createdAt: customDateFormatter(createdAt),
          status,
        });
      }
    }
    return acc;
  }, []);
  console.log(uniqueP);
  store.commit("setUniquePosters", uniqueP);
};

onMounted(async () => {
  if (!posters.value.length) {
    const res = await getPoster("");
    if (res.ok) {
      createUnique(res.poster);
    }
  } else {
    createUnique(posters.value);
  }
});
</script>

<template>
  <div>
    <DataTable
      :value="uniquePosters"
      scrollDirection="vertical"
      scrollable
      class="font-sf-pro mt-2"
    >
      <Column field="title" header="Title" sortable style="width: 30%"></Column>
      <Column
        v-if="user?.isAdmin"
        field="uploader"
        header="Uploader"
        sortable
        style="width: 20%"
      ></Column>
      <Column
        field="createdAt"
        header="Upload Date"
        sortable
        style="width: 20%"
      ></Column>
      <Column field="status" header="Status" style="width: 10%"></Column>
      <Column
        field="management"
        header="Management"
        style="width: 20%"
      ></Column>
    </DataTable>
  </div>
</template>

<style></style>

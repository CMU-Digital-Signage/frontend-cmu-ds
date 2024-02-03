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
import { customDateMonthFormatter } from "@/utils/constant";
import { User } from "@/types";
const posters = ref([]);
const user = computed<User>(() => store.state.userInfo);

onMounted(async () => {
  const res = await getPoster("");
  if (res.ok) {
    const uniquePosters = res.poster.reduce((acc: any[], e: any) => {
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
            createdAt: customDateMonthFormatter(createdAt),
            status,
          });
        } else if (e.id == user.value.id) {
          acc.push({
            title: e.title,
            uploader,
            createdAt: customDateMonthFormatter(createdAt),
            status,
          });
        }
      }
      return acc;
    }, []);

    console.log(uniquePosters);
    posters.value = uniquePosters;
  }
});
</script>

<template>
  <div>
    <DataTable
      :value="posters"
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

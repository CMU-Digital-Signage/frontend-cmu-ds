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
const posters = ref([]);

onMounted(async () => {
  const res = await getPoster("");
  if (res.ok) {
    const uniquePosters = res.poster.reduce((acc: any[], e: any) => {
      // Check if the title is not already in the accumulator
      if (!acc.some((poster) => poster.title === e.title)) {
        const user = store.getters.getUserById(e.id);
        const uploader = `${user.firstName} ${
          user?.lastName?.charAt(0) || ""
        }.`;

        acc.push({
          title: e.title,
          uploader,
          createdAt: new Date(e.startDate),
          status,
        });
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

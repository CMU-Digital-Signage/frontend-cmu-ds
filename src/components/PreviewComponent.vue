<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PreviewCompo",
});
</script>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { defineProps, computed } from "vue";
import store from "@/store";

const posters = computed(() => store.state.posters);
</script>

<template>
  <div class="flex flex-wrap">
    <button class="button1" style="">
      <i class="pi pi-play" style="color: gray; font-size: 3rem"></i>
    </button>
    <DataTable
      class="mt-2 text-[14px] lg:text-[16px]"
      :value="posters"
      tableStyle="min-width: 36rem"
    >
      <Column field="no" header="No" class="w-1/3"></Column>
      <Column field="title" header="Title" class="w-1/3"></Column>
      <Column field="duration" header="Display duration" class="w-1/3"></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.button1 {
  background-color: #d7d7d7;
  margin-top: 20px;
  margin-right: 50px;
  padding: 265px 250px;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(157, 157, 157);
}
</style>

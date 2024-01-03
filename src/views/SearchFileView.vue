<script setup lang="ts">
import store from "@/store";
import { computed, ref } from "vue";
import { month, day } from "../utils/constant";

const posters = computed(() => store.state.posters);
const date = new Date();

const mock = ref([
  {
    test: "123",
    date: date.getDate(),
    month: month[date.getMonth()],
    year: date.getFullYear(),
    day: day[date.getDay()],
  },
]);
</script>

<template>
  <div class="bg-[#b18b8b00] py-4 px-4 flex-1">
    <div class="h-full overflow-y-auto border-2 border-[#878787] rounded-xl">
      <div class="rectangle3">
        <DataTable
          columnResizeMode="fit"
          scrollDirection="vertical"
          scrollable
          scrollHeight="calc(100vh - 200px)"
          class="font-sf-pro rounded-2xl h-12"
          :value="posters"
        >
          <Column
            field="date"
            class="w-fit px-8 text-black font-bold text-[20px]"
            header=""
          ></Column>
          <Column
            class="w-fit text-black border-r-[#CFCECE] border-r-2 px-6"
            header=""
          >
            <template #body="item">
              <div class="flex flex-row gap-1">
                <p>{{ item.data.month }}</p>
                <p>{{ item.data.year }},</p>
                <p>{{ item.data.day }}</p>
              </div>
            </template>
          </Column>
          <Column field="time" class="w-fit" header=""></Column>
          <Column field="test" class="w-fit" header=""></Column>
          <Column field="title" class="w-full" header=""></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style></style>

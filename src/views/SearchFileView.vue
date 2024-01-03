<script setup lang="ts">
import store from "@/store";
import { computed, ref, watchEffect } from "vue";
import { month, day } from "../utils/constant";

const posters = computed(() => store.state.posters);
const data = ref();
watchEffect(() => {
  let temp = [] as any;
  posters.value.forEach((e: any) => {
    const startDate = new Date(e.startDate);
    const endDate = new Date(e.endDate);
    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      temp.push({
        date: currentDate.getUTCDate(),
        month: currentDate.getUTCMonth(),
        year: currentDate.getUTCFullYear(),
        day: currentDate.getUTCDay(),
        startTime: e.startTime,
        endTime: e.endTime,
        title: e.title,
      });
    }
  });
  temp.sort((a: any, b: any) => {
    const dateA = new Date(a.year, a.month, a.date);
    const dateB = new Date(b.year, b.month, b.date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    const timeA = new Date(`1970-01-01T${a.startTime}`);
    const timeB = new Date(`1970-01-01T${b.startTime}`);
    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;

    return 0;
  });
  data.value = temp;
});
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
          :value="data"
        >
          <Column
            field="date"
            class="w-fit px-8 text-black font-bold text-[20px]"
          />
          <Column class="w-fit text-black border-r-[#CFCECE] border-r-2 px-6">
            <template #body="item">
              <div class="flex flex-row gap-1">
                <p>{{ month[item.data.month] }}</p>
                <p>{{ item.data.year }},</p>
                <p>{{ day[item.data.day] }}</p>
              </div>
            </template>
          </Column>
          <Column>
            <template #body="item">
              <div class="flex flex-row gap-1">
                <p>
                  {{ ("0" + item.data.startTime.getUTCHours()).slice(-2) }}:{{
                    ("0" + item.data.startTime.getUTCMinutes()).slice(-2)
                  }}
                </p>
                <p>-</p>
                <p>
                  {{ ("0" + item.data.endTime.getUTCHours()).slice(-2) }}:{{
                    ("0" + item.data.endTime.getUTCMinutes()).slice(-2)
                  }}
                </p>
              </div>
            </template>
          </Column>
          <Column field="title" class="w-full"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style></style>

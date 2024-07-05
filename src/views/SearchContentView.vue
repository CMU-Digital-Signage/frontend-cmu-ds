<script setup lang="ts">
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { month, dayOfWeek } from "../utils/constant";
import { Device, Poster } from "@/types";

const devices = computed(() => store.state.devices);
const filterDevice = computed(() => store.state.filterDevice);
const searchPosters = computed(() => store.state.searchPosters);
const data = ref([]);
const filterData = ref([]);
const loading = computed(() => store.state.loading);

onMounted(() => {
  store.state.searchPosters = undefined;
});

watch(searchPosters, () => {
  let temp = [] as any;
  if (searchPosters.value) {
    searchPosters.value.forEach((e: Poster) => {
      const startDate = new Date(e.startDate);
      const endDate = new Date(e.endDate);
      for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        temp.push({
          MACaddress: e.MACaddress,
          color: devices.value
            ? devices.value.find((d) => d.MACaddress === e.MACaddress)?.color
            : "",
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          day: currentDate.getDay(),
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
    filterData.value = data.value;
  }
});

watch(filterDevice, () => {
  filterData.value = data.value.filter((e: Device) => {
    return filterDevice.value.includes(e.MACaddress!);
  });
});
</script>

<template>
  <div class="flex-1 mb-6 overflow-hidden">
    <div class="h-full overflow-y-auto p-4">
      <DataTable v-if="loading" :value="new Array(10)">
        <Column class="w-[243px] border-r-[#CFCECE] border-r-2">
          <template #body
            ><Skeleton width="100%" height="30px"></Skeleton
          ></template>
        </Column>
        <Column>
          <template #body
            ><Skeleton width="100%" height="30px"></Skeleton
          ></template>
        </Column>
      </DataTable>
      <DataTable
        v-else-if="searchPosters?.length"
        columnResizeMode="fit"
        scrollDirection="vertical"
        scrollable
        class="rounded-2xl h-12"
        :value="filterData"
        rowGroupMode="rowspan"
        groupRowsBy="date"
      >
        <Column
          field="date"
          class="w-fit text-black border-r-[#CFCECE] border-r-2 px-6"
        >
          <template #body="item">
            <div class="flex flex-row gap-1 items-center">
              <p class="w-fit mr-2 text-black font-bold text-[20px]">
                {{ item.data.date }}
              </p>
              <p>{{ month[item.data.month] }}</p>
              <p>{{ item.data.year }},</p>
              <p>{{ dayOfWeek[item.data.day] }}</p>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="item">
            <div class="flex flex-row gap-3 items-center">
              <i
                class="pi pi-circle-fill"
                :style="{ color: item.data.color }"
              ></i>
              <p>
                {{ ("0" + item.data.startTime.getHours()).slice(-2) }}:{{
                  ("0" + item.data.startTime.getMinutes()).slice(-2)
                }}
              </p>
              <p>-</p>
              <p>
                {{ ("0" + item.data.endTime.getHours()).slice(-2) }}:{{
                  ("0" + item.data.endTime.getMinutes()).slice(-2)
                }}
              </p>
            </div>
          </template>
        </Column>
        <Column field="title" class="w-full"></Column>
      </DataTable>
      <div v-else-if="!searchPosters"></div>
      <div
        v-else
        class="flex justify-center h-screen items-center align-middle"
      >
        No results found
      </div>
    </div>
  </div>
</template>

<style></style>

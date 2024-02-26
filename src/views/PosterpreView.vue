<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { defineProps, computed, ref, onMounted, watch } from "vue";
import store from "@/store";
import { useRoute } from "vue-router";
import Mac from "./device/[mac].vue";
import { dateFormatter } from "@/utils/constant";
import { ImageCollection } from "@/types";

const route = useRoute();
const mac = route.params.mac as string;
const currentDate = new Date();
const posters = computed(() =>
  store.state.posters.filter(
    (e) =>
      e.MACaddress == mac &&
      dateFormatter(currentDate) >= dateFormatter(e.startDate) &&
      dateFormatter(currentDate) <= dateFormatter(e.endDate) &&
      new Date().toTimeString() >= e.startTime.toTimeString() &&
      new Date().toTimeString() <= e.endTime.toTimeString()
  )
);

const selectTitle = ref<any>([]);
const selectImage = ref("");
let currentindex = 0;

watch(selectTitle, () => {
  // console.log(selectTitle.value);
  selectImage.value = selectTitle.value[0].image;
  currentindex = 0;
  // console.log(selectImage.value);
});

const changeImage = (index: number) => {
  if (selectTitle.value.length > 1) {
    const newIndex = (currentindex + index) % selectTitle.value.length;
    currentindex = newIndex;
    selectImage.value = selectTitle.value[newIndex].image;
  }
};
</script>

<template>
  <div class="rectangle">
    <div class="flex flex-wrap">
      <div
        class="flex-1 border-l-[2px]; border-[#eaeaea] py-[25px] px-[30px] flex flex-col"
      >
        <div
          class="w-full h-full rounded-xl border-[3px] border-black-300 bg-[#ffffff] flex items-center justify-center"
        >
          <button
            v-if="selectTitle.length > 1"
            class="pi pi-angle-left text-[30px]"
            @click="changeImage(-1)"
            :disabled="currentindex == 0"
            :class="
              currentindex == 0
                ? 'text-gray-400 hover:bg-white'
                : 'text-black hover:bg-gray-300 rounded-xl'
            "
          />
          <div
            class="w-11/12 h-full flex flex-wrap items-center justify-center"
          >
            <img
              v-if="selectImage"
              class="m-auto h-full w-full rotated-image"
              :src="selectImage"
            />
            <div v-else style="">
              <button class="pi pi-play" style="color: gray; font-size: 3rem" />
            </div>
          </div>
          <button
            v-if="selectTitle.length > 1"
            class="pi pi-angle-right text-[30px]"
            @click="changeImage(1)"
            :disabled="currentindex == selectTitle.length - 1"
            :class="
              currentindex == selectTitle.length - 1
                ? 'text-gray-400 hover:bg-white'
                : 'text-black hover:bg-gray-300 rounded-xl'
            "
          />
        </div>
      </div>
      <DataTable
        class="mt-2 text-[14px] lg:text-[16px]"
        :value="posters"
        tableStyle="min-width: 36rem"
      >
        <Column header="No." class="w-1/3">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column
          field="title"
          header="Title"
          class="w-1/3"
          :bodyClass="'hover:bg-gray-200'"
          ><template #body="rowData">
            <div
              style="cursor: pointer"
              @click="selectTitle = rowData.data.image"
            >
              {{ rowData.data.title }}
            </div>
          </template></Column
        >
        <Column
          field="duration"
          header="Display duration"
          class="w-1/3"
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.rectangle {
  flex: 1 1;
  padding-inline: 1.5rem;
  margin-bottom: 3.5rem;
  overflow-y: auto;
}

.fade {
  animation-name: fade;
  animation-duration: 1.5s;
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
</style>

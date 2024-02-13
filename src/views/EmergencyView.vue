<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue";
import Instructor from "@/components/InstructorCompo.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { getEmergency } from "@/services";
import { Emergency } from "@/types";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

const emerPosters = computed(() => store.state.emerPosters);

const selectEmer = ref("");
const selectedPosterImage = ref("");
const confirmationText = ref("");
const isConfirmationValid = computed(
  () => selectEmer.value === confirmationText.value
);

watch(selectEmer, () => {
  console.log(selectEmer.value);
  const selectedEmergency = emerPosters.value.find(
    (emergency) => emergency.incidentName === selectEmer.value
  );
  if (selectedEmergency) {
    selectedPosterImage.value = selectedEmergency.emergencyImage;
  }
});

onMounted(async () => {
  if (!emerPosters.value.length) {
    const res = await getEmergency();
    if (res.ok) {
      res.emergency.forEach(
        (e: Emergency) => (e.status = e.status ? "Active" : "Inactive")
      );
      store.state.emerPosters = res.emergency;
    }
  }
});
</script>

<template>
  <div class="rectangleOut flex flex-row">
    <div class="rectangleLeft flex flex-col text-left justify-between">
      <div>
        <p class="text-[18px] mb-8">
          <span style="color: red; font-weight: bold"
            >Activating the Emergency Poster</span
          >, there is overriding currently running poster.
          <span style="font-weight: bold">Please be certain. </span>
        </p>
        <p class="text-[17px] font-bold mb-2">Choose Poster to displayed</p>
        <div
          class="border-[2px] border-black-200 rounded-lg h-60 p-5 overflow-y-scroll"
        >
          <div
            v-for="category in emerPosters"
            :key="category.incidentName"
            class="flex text-[16px] gap-2 m-1 mb-3"
          >
            <RadioButton
              v-model="selectEmer"
              :inputId="category.incidentName"
              :value="category.incidentName"
            />
            <label :for="category.incidentName" class="ml-2">{{
              category.incidentName
            }}</label>
          </div>
        </div>
        <!-- <div class="flex justify-end">
          <Button
            class="flex bg-while my-2 p-2 bg-white w-38 py-1 gap-2 items-center rounded-lg border-[#A3A3A3] text-black border-opacity-30 border-2 font-semibold bold-ho hover:bg-gray-200"
          >
            <i class="pi pi-plus text-black"></i>

            Add Text
          </Button>
        </div> -->
        <div class="flex flex-row gap-3 mt-4">
          <RadioButton v-model="selectEmer" :value="1" />
          <div class="flex flex-col gap-2 w-full">
            <label for="username">Text Title (ลอง)</label>
            <textarea
              class="border-[2px] border-[#DBDBDB] p-3 rounded-lg h-[130px] bg-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      <div v-if="selectEmer">
        <p class="text-[18px] font-semibold mb-2">
          To confirm, type password in the box below
        </p>
        <div class="flex flex-col">
          <InputText class="w-full mb-2" v-model="confirmationText"></InputText>
          <Button
            class="w-full bg-red-500 rounded-lg border-0"
            :disabled="!isConfirmationValid"
            label="Activate"
          ></Button>
        </div>
      </div>
    </div>

    <div class="rectangleRight flex flex-col">
      <div class="rectangleRightIn">
        <div class="w-full h-full overflow-hidden">
          <img
            v-if="selectedPosterImage"
            class="m-auto mt-28 transition-opacity rotated-image"
            :src="selectedPosterImage"
            alt="poster-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangleOut {
  overflow: hidden;
  background-color: aquamarine;
  flex: 1 1;
}

.rectangleLeft {
  background-color: #fafafa;
  /* height: 100vh; */
  width: 40vw;
  padding-top: 25px;
  padding-left: 26px;
  padding-right: 30px;
  padding-bottom: 25px;
  flex: 1 1;
}

.rotated-image {
  transform: rotate(90deg);
}

.rectangleLeftIn {
  background-color: #fafafa;
  /* height: 10vh;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 30px; */
  overflow-y: scroll;
  flex: 1 1;
}

.rectangleRight {
  background-color: #fafafa;
  height: 100vh;
  width: 40vw;
  padding-top: 30px;
  padding-left: 26px;
  padding-right: 30px;
  padding-bottom: 80px;
  flex: 1 1;
  border-left: solid 2px;
  border-color: #eaeaea;
}

.rectangleRightIn {
  background-color: #fafafa;
  height: 10vh;
  border-radius: 15px;
  overflow-y: scroll;
  flex: 1 1;
}
</style>

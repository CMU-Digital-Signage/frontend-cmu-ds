<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue";
import Instructor from "@/components/InstructorCompo.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import {
  activateEmergency,
  deactivateEmergency,
  getEmergency,
} from "@/services";
import { Emergency } from "@/types";

const click = computed({
  get: () => store.state.selectTabview,
  set: (val) => (store.state.selectTabview = val),
});

const emerPosters = computed(() => store.state.emerPosters);

const selectEmer = ref("");
const selectBanner = ref(false);
// const selectEmerText = ref("");
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
    selectBanner.value = false;
  }
});

watch(selectBanner, () => {
  if (selectBanner.value) {
    selectEmer.value = "";
    selectedPosterImage.value = "";
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
        <div
          class="flex flex-row mb-6 gap-7 bg-[#ffe5e5] rounded-lg h-20 items-center border-red-500 border-2"
        >
          <div
            class="w-8 h-8 ml-5 flex items-center justify-center rounded-full"
          >
            <i
              class="pi pi-exclamation-triangle mb-1 text-red-500 text-3xl"
            ></i>
          </div>

          <div>
            <p class="text-[16px] font-bold text-red-500">
              <span>Activating the Emergency Poster</span>
            </p>
            <p>
              there is overriding currently running poster.
              <span class="font-semibold">Please be certain. </span>
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-[16px] font-semibold mb-2">
              Choose Poster to displayed
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-40 overflow-y-scroll"
            >
              <div class="grid grid-cols-2 gap-y-10 p-8 pt-9">
                <div
                  v-for="category in emerPosters"
                  :key="category.incidentName"
                  class="flex text-[16px] gap-2 items-center h-1"
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
            </div>
          </div>

          <div>
            <p class="text-[16px] font-semibold mb-2">
              Type text to display banner
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-48"
            >
              <div class="flex flex-col gap-3 mx-8 my-5">
                <div class="flex gap-2 items-center">
                  <RadioButton :value="true" v-model="selectBanner" />
                  <label for="username">Banner</label>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <Textarea
                    :disabled="!selectBanner"
                    placeholder="Ex: There's a fire, do not use the elevator"
                    class="border-[2px] border-[#DBDBDB] p-3 rounded-lg h-[110px] bg-none resize-none"
                  ></Textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectEmer || selectBanner">
        <p class="text-[17px] font-semibold mb-2">
          Type your password in the box below
        </p>
        <div class="flex flex-col">
          <InputText class="w-full mb-2" v-model="confirmationText"></InputText>
          <Button
            class="w-full bg-red-500 rounded-lg border-0"
            :disabled="!isConfirmationValid"
            :label="
              emerPosters.filter((e) => e.incidentName === selectEmer)[0]
                .status === 'Active'
                ? 'Deactivate'
                : 'Activate'
            "
            @click="
              async () => {
                emerPosters.filter((e) => e.incidentName === selectEmer)[0]
                  .status === 'Active'
                  ? await deactivateEmergency(selectEmer)
                  : await activateEmergency(selectEmer);
              }
            "
          ></Button>
        </div>
      </div>
    </div>

    <div class="rectangleRight flex flex-col">
      <div
        class="w-full h-full overflow-y-scroll rounded-xl border-[3px] border-black-300 bg-[#f8f8f8] flex items-center justify-center"
      >
        <div class="w-11/12 h-full flex items-center">
          <img
            v-if="selectedPosterImage"
            class="m-auto w-full transition-opacity rotated-image"
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
  overscroll-behavior-y: contain;
  overflow: hidden;
  background-color: aquamarine;
  flex: 1 1;
}

.rectangleLeft {
  background-color: #fafafa;
  overflow-y: hidden;
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
  height: 10vh;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 30px;
  overflow-y: scroll;
  flex: 1 1;
}

.rectangleRight {
  background-color: #fafafa;
  height: 98 100vh;
  width: 40vw;
  padding-top: 25px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 25px;
  flex: 1 1;
  border-left: solid 2px;
  border-color: #eaeaea;
}

.rectangleRightIn {
  background-color: #642121;
  height: 10vh;
  border-radius: 18px;
  overflow-y: hidden;
  flex: 1 1;
}
</style>

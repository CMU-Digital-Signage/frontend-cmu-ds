<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadNormal",
});
</script>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import ScheduleForm from "./ScheduleForm.vue";
import InputText from "primevue/inputtext";
import { initialFormDisplay, onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const scheduleTabs = reactive([{ header: "Schedule 1" }]);

const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const currentDeg = ref(0);
const currentI = ref(0);
const toast = useToast();

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

const addSchedule = () => {
  const lastSchedule = formDisplay.value.at(formDisplay.value.length - 1);
  if (
    !lastSchedule?.startDate ||
    !lastSchedule?.endDate ||
    (!lastSchedule.MACaddress.length && !lastSchedule.allDevice) ||
    !lastSchedule.duration
  ) {
    toast.add({
      severity: "error",
      summary: "Invalid Input",
      detail: "Invalid Input.",
      life: 3000,
    });
    return;
  }
  store.state.formDisplay.push({ ...initialFormDisplay });
  const newSchedule = {
    header: `${scheduleTabs.length + 1}`,
  };
  scheduleTabs.push(newSchedule);
  currentI.value++;
};

const deleteSchedule = (index: number) => {
  if (index >= 0 && index < scheduleTabs.length) {
    store.state.formDisplay.splice(index, 1);
    scheduleTabs.splice(index, 1);
    currentI.value == scheduleTabs.length ? currentI.value-- : currentI.value;

    if (scheduleTabs.length > 1) {
      scheduleTabs.forEach((schedule, i) => {
        if (i > 0) {
          schedule.header = `${i + 1}`;
        }
      });
    }
  }
};
</script>

<template>
  <Toast />
  <div class="flex flex-row justify-between gap-3 mx-1">
    <div class="flex flex-col justify-start w-screen max-w-4xl gap-5">
      <!-- File Upload -->
      <FileUpload
        accept="image/*"
        :show-upload-button="false"
        :multiple="false"
        @select="
          async (e) => {
            if (e.files[0]) formPoster.image = await onUpload(e);
            else errorSelectFile();
          }
        "
      >
  
        <template #header="{ files, chooseCallback, clearCallback }">
          <div class="flex w-full gap-3 items-center justify-between">
            <div class="flex gap-3 items-center">
              <Button
                @click="
                  clearCallback();
                  formPoster.image = null;
                  currentDeg = 0;
                  chooseCallback();
                "
                icon="pi pi-plus"
                label="Choose File"
                rounded
                outlined
              />
            </div>
            <div class="flex gap-3 items-center">
              <Button
                @click="
                  async () => {
                    const { imageDataUrl, newDeg } = await rotate(
                      files[0],
                      currentDeg,
                      -90
                    );
                    formPoster.image = imageDataUrl;
                    currentDeg = newDeg;
                  }
                "
                :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-replay"
                rounded
                outlined
                :disabled="!formPoster.image"
              />
              <Button
                @click="
                  async () => {
                    const { imageDataUrl, newDeg } = await rotate(
                      files[0],
                      currentDeg,
                      90
                    );
                    formPoster.image = imageDataUrl;
                    currentDeg = newDeg;
                  }
                "
                :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-refresh"
                rounded
                outlined
                :disabled="!formPoster.image"
              />
            </div>
          </div>
        </template>
        <template #content="{ files }">
          <div
            v-if="files[0] && formPoster.image"
            class="flex flex-row justify-center text-center items-center gap-3"
          >
            <i class="pi pi-power-off"></i>
            <div
              class="flex justify-center border-2 border-black bg-black"
              :style="{
                width: `${2160 / 20}px`,
                height: `${3840 / 20}px`,
              }"
            >
              <img
                :alt="files[0].name"
                :src="formPoster.image"
                class="max-w-full max-h-full m-auto rotate-90"
                :style="{
                  maxWidth: `${3840 / 20}px`,
                  maxHeight: `${2160 / 20}px`,
                }"
              />
            </div>
          </div>
          <div
            v-else
            class="flex flex-col justify-center items-center h-48 gap-3"
          >
            <i
              class="pi pi-cloud-upload border-2 rounded-full text-4xl w-fit p-4 mt-1"
            ></i>
            <p class="mt-3 mb-0">Drag and drop files to here.</p>
            <!-- <p class="text-[#176EE2] red">Support JPEG only.</p> -->
          </div>
        </template>
      </FileUpload>
      <InputText
        v-model="formPoster.title"
        type="text"
        placeholder="Title"
        class="title-input"
      />

      <!-- Description -->
      <div class="flex flex-col gap-2 w-full h-full">
        <label
          class="text-[#282828] font-semibold text-[18px] flex justify-start"
          >Description</label
        >
        <InputText
          v-model="formPoster.description"
          type="text"
          class="description-input h-full"
        />
      </div>
    </div>

    <!-- Schedule -->
    <!-- <div class="w-full max-w-4xl">
      <div class="rectangle8 flex items-start">
        <TabView
          class="rectangleflex flex-row flex-1 justify-between w-56 scroll-x"
          v-model:active-index="currentI"
        >
          <TabPanel
            v-for="(schedule, index) in scheduleTabs"
            :key="index"
            :header="schedule.header"
          >
            <ScheduleForm v-if="formDisplay[index]" :index="index" />
          </TabPanel>
        </TabView>
        <div class="flex flex-col justify-center ml-5">
          <Button
            @click="addSchedule()"
            class="flex items-center justify-center mt-3 rounded-md w-8 h-8"
            ><i class="pi pi-plus text-white"></i
          ></Button>
          <Button
            v-if="currentI !== 0"
            @click="deleteSchedule(currentI)"
            class="flex items-center justify-center mt-3 rounded-md w-8 h-8"
            severity="danger"
            ><i class="pi pi-trash text-white"></i
          ></Button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style>
.title-input {
  box-shadow: none;
  border: none;
  border-radius: 0%;
  border-bottom: 2px solid #aaa;
  padding: 1px;
  color: #000000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
  margin-top: 16px;
}

.description-input {
  box-shadow: none;
  border-radius: 10px;
  border: 1px solid #4a484c;
}
</style>

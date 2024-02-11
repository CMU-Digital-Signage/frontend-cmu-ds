<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PopupUpload",
});
</script>

<script setup lang="ts">
import store from "@/store";
import { useToast } from "primevue/usetoast";
import { computed, ref, reactive, warn, watch } from "vue";
import { newInitialFormDisplay, onUpload, rotate } from "@/utils/constant";
import ScheduleForm from "@/components/ScheduleForm.vue";

const user = computed(() => store.state.userInfo);
const show = computed({
  get: () => store.state.showUpload,
  set: (val) => (store.state.showUpload = val),
});
const uploadState = ref([
  { label: "Schedule" },
  { label: "Uploaded" },
  { label: "Review" },
]);
const posterType = ref([
  { header: "Normal Poster", code: "NP" },
  { header: "Emergency Poster", code: "EP" },
]);
const selectedPosterType = ref({ header: "", code: "NP" });
const currentState = ref(0);
const scheduleTabs = reactive([{ header: "Schedule 1", index: 0 }]);
const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const formEmer = computed(() => store.state.formEmer);
const currentDeg = ref(0);
const selectSchedule = ref(scheduleTabs[0]);
const showSecondDialog = ref(false);

const toast = useToast();

const isNextButtonDisabled = computed(() => {
  return !selectedPosterType.value.header;
});
const showDifferentDialog = () => {
  store.state.showUpload = false;
  if (selectedPosterType.value.code === "NP") {
    selectedPosterType.value = {
      header: "Normal Poster",
      code: "NP",
    };
  } else if (selectedPosterType.value.code === "EP") {
    selectedPosterType.value = {
      header: "Emergency Poster",
      code: "EP",
    };
  }
  showSecondDialog.value = true;
};

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

const addSchedule = () => {
  // const lastSchedule = formDisplay.value.at(formDisplay.value.length - 1);
  // if (
  //   !lastSchedule?.startDate ||
  //   !lastSchedule?.endDate ||
  //   (!lastSchedule.MACaddress.length && !lastSchedule.allDevice) ||
  //   !lastSchedule.duration
  // ) {
  //   toast.add({
  //     severity: "error",
  //     summary: "Invalid Input",
  //     detail: "Invalid Input.",
  //     life: 3000,
  //   });
  //   return;
  // }

  console.log(newInitialFormDisplay());

  store.state.formDisplay.push(newInitialFormDisplay());
  // store.commit("addSchedule");

  const newSchedule = {
    header: `Schedule ${scheduleTabs.length + 1}`,
    index: scheduleTabs.length,
  };
  scheduleTabs.push(newSchedule);
  selectSchedule.value = scheduleTabs[scheduleTabs.length - 1];
};

const deleteSchedule = (index: number) => {
  if (index >= 0 && index < scheduleTabs.length) {
    store.state.formDisplay.splice(index, 1);
    scheduleTabs.splice(index, 1);
    selectSchedule.value.index == scheduleTabs.length
      ? selectSchedule.value.index--
      : selectSchedule.value.index;

    if (scheduleTabs.length > 1) {
      scheduleTabs.forEach((schedule, i) => {
        if (i > 0) {
          schedule.header = `${i + 1}`;
        }
      });
    }
  }
};

// watch([show, showSecondDialog], () => {
//   if (!show.value && !showSecondDialog.value) {
//     selectedPosterType.value = { header: "", code: "" };
//     currentState.value = 0;
//     store.commit("resetForm");
//   }
// });
</script>

<template>
  <Toast />
  <div>
    <Dialog
      v-model:visible="show"
      modal
      close-on-escape
      :draggable="false"
      class="w-96"
    >
      <template #header>
        <div class="header-popup">Upload File</div>
      </template>
      <div class="flex flex-col gap-2">
        <div class="inline-block">
          <div v-if="user?.isAdmin">
            <label
              for="deviceName"
              class="flex justify-start font-semibold text-[18px] text-[#282828]"
              >Type of Poster</label
            >
          </div>
          <Dropdown
            v-model="selectedPosterType"
            :options="posterType"
            optionLabel="header"
            placeholder="Select poster"
            class="w-full md:w-14rem mt-1"
          />

          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Cancel"
              @click="store.state.showUpload = false"
              :class="'secondaryButton'"
            ></Button>
            <Button
              label="Next"
              :class="'primaryButton'"
              type="submit"
              :disabled="isNextButtonDisabled"
              @click="showDifferentDialog"
            ></Button>
          </div>
        </div>
      </div>
    </Dialog>

    <Dialog
      v-if="showSecondDialog"
      v-model:visible="showSecondDialog"
      :header="selectedPosterType.header"
      modal
      close-on-escape
      :draggable="false"
      class="w-[600px]"
    >
      <div v-if="selectedPosterType.code === 'NP'">
        <Steps class="mb-5" :model="uploadState" :active-step="currentState" />
        <div v-if="currentState === 0">
          <div class="inline-flex items-center">
            <label
              class="text-[#282828] font-semibold text-[18px] flex justify-start mt-5 mb-1"
            >
              Title
            </label>
            <label class="text-[#FF0000] mt-1 font-medium"> * </label>
          </div>
          <InputText
            v-model="formPoster.title"
            type="text"
            placeholder="Ex.CPE Music Box"
            class="title-input w-full mb-3"
          />

          <label
            class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
          >
            Description
          </label>
          <InputText
            v-model="formPoster.description"
            class="description-input h-full w-full mb-5"
            placeholder="(Optional)"
          />

          <div class="line-separator"></div>

          <Dropdown
            v-model="selectSchedule"
            :options="scheduleTabs"
            optionLabel="header"
            class="w-full md:w-14rem mt-3"
          >
          </Dropdown>
          <ScheduleForm
            v-for="(schedule, index) in scheduleTabs"
            v-show="index === selectSchedule.index"
            :key="schedule.header"
            :index="index"
          />

          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Add Schedule"
              :class="'secondaryButton'"
              @click="addSchedule"
            ></Button>
            <Button
              label="Next"
              @click="currentState = 1"
              :class="'primaryButton'"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 1">
          <FileUpload
            class="mt-12"
            accept="image/*"
            :show-upload-button="false"
            @select="
              async (e) => {
                if (e.files[0]) formPoster.image = await onUpload(e);
                else errorSelectFile();
              }
            "
          >
            <template #header="{ chooseCallback, clearCallback }">
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
          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Back"
              :class="'secondaryButton'"
              @click="currentState = 0"
            ></Button>
            <Button
              label="Next"
              :class="'primaryButton'"
              @click="currentState = 2"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 2">
          <label
            class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
          >
            Orientation
          </label>
          <div class="orientOut">
            <div class="flex gap-3 items-center">
              <template header="files">
                <Button
                  @click="rotate(files[0], currentDeg, -90)"
                  :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                  icon="pi pi-replay"
                  rounded
                  outlined
                  :disabled="!formPoster.image"
                />
                <Button
                  @click="rotate(files[0], currentDeg, 90)"
                  :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                  icon="pi pi-refresh"
                  rounded
                  outlined
                  :disabled="!formPoster.image"
                />
              </template>
            </div>
          </div>
          <label
            class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1 mt-3"
          >
            Review
          </label>
          <Button
            label="Back"
            :class="'secondaryButton'"
            @click="currentState = 1"
          ></Button>
          <Button label="Upload" :class="'primaryButton'"></Button>
        </div>
      </div>

      <div v-else-if="selectedPosterType.code === 'EP'">
        <div class="flex flex-row justify-between gap-3 mx-1">
          <div class="flex flex-col justify-start w-full max-w-4xl">
            <div class="inline-flex items-center">
              <label
                class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
              >
                Title
              </label>
              <label class="text-[#FF0000] mb-3 font-medium"> * </label>
            </div>
            <InputText
              v-model="formEmer.incidentName"
              type="text"
              placeholder="Ex. Gas leakage"
              class="title-input mb-3"
            />
            <!-- File Upload -->
            <FileUpload
              accept="image/*"
              :show-upload-button="false"
              :multiple="false"
              @select="
                async (e) => {
                  if (e.files[0]) formEmer.emergencyImage = await onUpload(e);
                  else errorSelectFile();
                }
              "
              :pt="{
                buttonbar: {
                  class: 'border-[#f00] bg-[#f00] bg-opacity-10',
                },
                content: {
                  class: 'border-[#f00]',
                },
              }"
            >
              <template #header="{ files, chooseCallback, clearCallback }">
                <div class="flex w-full gap-3 items-center justify-between">
                  <div class="flex gap-3 items-center">
                    <Button
                      @click="
                        clearCallback();
                        formEmer.emergencyImage = null;
                        currentDeg = 0;
                        chooseCallback();
                      "
                      icon="pi pi-plus"
                      label="Choose File"
                      rounded
                      outlined
                    />
                    <Button
                      @click="
                        () => {
                          clearCallback();
                          formEmer.emergencyImage = null;
                          currentDeg = 0;
                        }
                      "
                      :class="`${
                        formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'
                      }`"
                      icon="pi pi-times"
                      label="Cancel"
                      rounded
                      outlined
                      severity="danger"
                      :disabled="!formEmer.emergencyImage"
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
                          formEmer.emergencyImage = imageDataUrl;
                          currentDeg = newDeg;
                        }
                      "
                      :class="`${
                        formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'
                      }`"
                      icon="pi pi-replay"
                      rounded
                      outlined
                      :disabled="!formEmer.emergencyImage"
                    />
                    <Button
                      @click="
                        async () => {
                          const { imageDataUrl, newDeg } = await rotate(
                            files[0],
                            currentDeg,
                            90
                          );
                          formEmer.emergencyImage = imageDataUrl;
                          currentDeg = newDeg;
                        }
                      "
                      :class="`${
                        formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'
                      }`"
                      icon="pi pi-refresh"
                      rounded
                      outlined
                      :disabled="!formEmer.emergencyImage"
                    />
                  </div>
                </div>
              </template>
              <template #content="{ files }">
                <div
                  v-if="files[0] && formEmer.emergencyImage"
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
                      :src="formEmer.emergencyImage"
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

            <!-- Description -->
            <div class="flex flex-col gap-1 w-full">
              <label
                for="Description"
                class="text-[#282828] mt-3 font-semibold text-[18px] flex justify-start"
                >Description</label
              >
              <InputText
                v-model="formEmer.description"
                type="text"
                placeholder="(optional)"
                class="description-input h-full"
              ></InputText>
            </div>
            <Button label="Upload" :class="'primaryButtonEmer'"></Button>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.bold-ho:hover {
  font-weight: 600;
  background-color: #e2e2e2;
}

.bold-ho-add:hover {
  font-weight: 800;
  text-decoration: underline;
  background-color: #a0dbfb;
}

.header-popup {
  font-weight: 700;
  font-size: 22px;
}

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: white;
  color: black;
  cursor: pointer;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.primaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: white;
  color: rgb(43, 152, 255);
  font-weight: 800;
  cursor: pointer;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: rgb(228, 233, 255);
  text-decoration-line: underline;
}

.primaryButtonEmer {
  width: 100%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: white;
  color: rgb(255, 107, 43);
  font-weight: 800;
  cursor: pointer;
}

.primaryButtonEmer:hover {
  cursor: pointer;
  background-color: rgb(255, 233, 228);
  text-decoration-line: underline;
}

.line-separator {
  border-top: 3px solid #b4b4b4;
  margin: 15px 0;
}

.orientOut {
  background-color: rgb(194, 88, 88);
  height: 50vh;
  width: full;
  padding-top: 30px;
  padding-left: 26px;
  padding-right: 30px;
  padding-bottom: 80px;
  flex: 1 1;
}
</style>

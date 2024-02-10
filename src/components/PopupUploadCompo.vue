<script lang="ts">
import { defineComponent } from "vue";
import { C } from "@fullcalendar/core/internal-common";
export default defineComponent({
  name: "PopupUpload",
});
</script>

<script setup lang="ts">
import store from "@/store";
import { useToast } from "primevue/usetoast";
import { computed, ref, reactive, warn, watch } from "vue";
import { initialFormDisplay, onUpload, rotate } from "@/utils/constant";
import ScheduleForm from "./ScheduleForm.vue";

const show = computed({
  get: () => store.state.showUpload,
  set: (val) => (store.state.showUpload = val),
});
const user = computed(() => store.state.userInfo);
const isNextButtonDisabled = computed(() => {
  return !selectedPoster.value;
});
const showDifferentDialog = () => {
  store.state.showUpload = false;
  if (selectedPoster.value.code === "NP") {
    selectedDialog.value = {
      header: "Normal Poster",
    };
  } else if (selectedPoster.value.code === "EP") {
    selectedDialog.value = {
      header: "Emergency Poster",
    };
  }
};

const items = ref([
  { label: "Schedule" },
  { label: "Uploaded" },
  { label: "Review" },
]);

const selectedItem = ref(0);

const selectedDialog = ref({ header: "" });

const selectedPoster = ref();
const showSecondDialog = ref(false);
const posters = ref([
  { name: "Normal Poster", code: "NP" },
  { name: "Emergency Poster", code: "EP" },
]);

const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const currentDeg = ref(0);

const toast = useToast();
const scheduleTabs = reactive([{ header: "Schedule 1" }]);
const selectSchedule = ref(scheduleTabs[0].header);
const currentIndexSchedule = ref(0);

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
  // store.state.formDisplay.push({ ...initialFormDisplay });
  const newSchedule = {
    header: `Schedule ${scheduleTabs.length + 1}`,
  };
  scheduleTabs.push(newSchedule);
  currentIndexSchedule.value++;
  // selectSchedule.value = scheduleTabs[scheduleTabs.length].header;
};
</script>

<template>
  <Toast />
  <div>
    <Dialog
      v-if="!showSecondDialog"
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
            <label for="deviceName" class="flex justify-start font-semibold text-[18px] text-[#282828]"
              >Type of Poster</label
            >
          </div>
          <Dropdown
            v-model="selectedPoster"
            :options="posters"
            optionLabel="name"
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
      modal
      close-on-escape
      :draggable="false"
      class="w-[600px]"
    >
      <template #header>
        <div class="header-popup">{{ selectedDialog.header }}</div>
      </template>
      <div v-if="selectedPoster.code === 'NP'">
        <Steps :model="items" :active-step="selectedItem" />
        <div v-if="selectedItem === 0">
          <div class="inline-flex items-center">
            <label
              class="text-[#282828] font-semibold text-[18px] flex justify-start mt-5 mb-1"
              >Title</label
            >
            <label class="text-[#FF0000] mt-1 font-medium">*</label>
          </div>
          <InputText
            v-model="formPoster.title"
            type="text"
            placeholder="Ex.CPE Music Box"
            class="title-input w-full mb-3"
          />

          <label
            class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
            >Description</label
          >
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
            optionValue="header"
            class="w-full md:w-14rem mt-3"
          >
          </Dropdown>
          <ScheduleForm
            v-if="formDisplay[currentIndexSchedule]"
            :index="currentIndexSchedule"
          />

          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Add Schedule"
              :class="'secondaryButton'"
              @click="addSchedule"
            ></Button>
            <Button
              label="Next"
              @click="selectedItem = 1"
              :class="'primaryButton'"
            ></Button>
          </div>
        </div>
        <div v-if="selectedItem === 1">
          <FileUpload
            cl
            accept="image/*"
            :show-upload-button="false"
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
          <div class="flex flex-row gap-4 pt-3">
            <Button
              label="Back"
              :class="'secondaryButton'"
              @click="selectedItem = 0"
            ></Button>
            <Button
              label="Next"
              :class="'primaryButton'"
              @click="selectedItem = 2"
            ></Button>
          </div>
          <p>ffrhfbrbvhrss</p>
        </div>
        <div v-if="selectedItem === 2">
          <Button
            label="Back"
            :class="'secondaryButton'"
            @click="selectedItem = 1"
          ></Button>
          <Button label="Upload" :class="'primaryButton'"></Button>
          <p>review</p>
        </div>
      </div>
      <div v-else-if="selectedPoster === 'EP'">
        <p>sssseff</p>
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

.line-separator {
  border-top: 3px solid #b4b4b4;
  margin: 15px 0;
}
</style>

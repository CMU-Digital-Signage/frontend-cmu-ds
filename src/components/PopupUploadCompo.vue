<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PopupUpload",
});
</script>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import store from "@/store";
import router from "@/router";
import { addEmergency, addPoster, editEmergency, editPoster } from "@/services";
import { Poster } from "@/types";
import {
  dateFormatter,
  createUnique,
  newInitialFormDisplay,
  rotate,
} from "@/utils/constant";
import { useToast } from "primevue/usetoast";
import ScheduleForm from "@/components/ScheduleForm.vue";
import UploadImage from "@/components/UploadImageCompo.vue";

const toast = useToast();
const user = computed(() => store.state.userInfo);
const showUpload = computed({
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
const selectedPosterType = ref({ header: "", code: "" });
const currentState = ref(0);
const scheduleTabs = ref<{ header: string; index: number }[]>([
  { header: `Schedule 1`, index: 0 },
]);
const posters = computed(() => store.state.posters);
const editPosterType = computed(() => store.state.editPoster);
const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const formEmer = computed(() => store.state.formEmer);
const maxImage = ref(0);
const selectRotate = ref({ image: "", priority: 1 });
const selectSchedule = ref({ header: `Schedule 1`, index: 0 });
const showSecondDialog = ref(false);
const loading = ref(false);

const createScheduleTabs = () => {
  formDisplay.value.forEach((e, i) => {
    scheduleTabs.value.push({ header: `Schedule ${i + 1}`, index: i });
  });
  selectSchedule.value = scheduleTabs.value[scheduleTabs.value.length - 1];
};

watch(
  () => store.state.formDisplay,
  () => {
    scheduleTabs.value = [];
    createScheduleTabs();
  },
  { deep: true }
);

watch([showUpload, showSecondDialog, editPosterType.value], () => {
  if (editPosterType.value.type && showUpload.value) {
    posterType.value.map((e) => {
      if (e.code === editPosterType.value.type) {
        selectedPosterType.value = { ...e };
      }
    });
    showUpload.value = false;
    showSecondDialog.value = true;
  } else if (showUpload.value && !user.value.isAdmin) {
    selectedPosterType.value = posterType.value[0];
    showUpload.value = false;
    showSecondDialog.value = true;
  } else if (!showUpload.value && !showSecondDialog.value) {
    store.state.editPoster = { title: "", type: "" };
    selectedPosterType.value = { header: "", code: "" };
    store.commit("resetForm");
  }
  currentState.value = 0;
});

const validateForm = () => {
  if (
    (selectedPosterType.value.code === "NP" && !formPoster.value.title) ||
    (selectedPosterType.value.code === "EP" && !formEmer.value.incidentName)
  ) {
    return "Title Invalid";
  }

  const invalidSchedule = formDisplay.value.find(
    (e) =>
      (!e.MACaddress.length && !e.allDevice) ||
      !e.duration ||
      !e.startDate ||
      !e.endDate
  );

  if (invalidSchedule) {
    return "Schedule Invalid.";
  }
};

const handleAddEmergency = async () => {
  const res = await addEmergency(formEmer.value);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Emergency has been add successfully.",
      life: 3000,
    });
    showSecondDialog.value = false;
    store.commit("resetForm");
    store.state.emerPosters.push(res.emergency);
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const handleAddPoster = async () => {
  const res = await addPoster(formPoster.value, formDisplay.value);
  if (res.ok) {
    let newPoster = [] as Poster[];
    formDisplay.value.forEach((e) => {
      e.time.forEach((time) => {
        newPoster;
        e.MACaddress.forEach(async (mac) => {
          newPoster.push({
            ...formPoster.value,
            MACaddress: mac,
            startDate: e.startDate!,
            endDate: e.endDate!,
            startTime: time.startTime!,
            endTime: time.endTime!,
          });
        });
      });
    });
    store.state.posters.push(...newPoster);
    createUnique(posters.value);
    showSecondDialog.value = false;
    store.commit("resetForm");
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Poster has been add successfully.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const handleEditEmergency = async () => {
  const res = await editEmergency(editPosterType.value.title, formEmer.value);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Emergency has been add successfully.",
      life: 3000,
    });
    showSecondDialog.value = false;
    store.commit("resetForm");
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const handleEditPoster = async () => {
  const res = await editPoster(formPoster.value, formDisplay.value);
  if (res.ok) {
    let newPoster = [] as Poster[];
    formDisplay.value.forEach((e) => {
      e.time.forEach((time) => {
        newPoster;
        e.MACaddress.forEach(async (mac) => {
          newPoster.push({
            ...formPoster.value,
            MACaddress: mac,
            startDate: e.startDate!,
            endDate: e.endDate!,
            startTime: time.startTime!,
            endTime: time.endTime!,
          });
        });
      });
    });
    store.state.posters.push(...newPoster);
    createUnique(posters.value);
    showSecondDialog.value = false;
    store.commit("resetForm");
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Poster has been add successfully.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const uploadPoster = async () => {
  loading.value = true;
  if (formEmer.value.incidentName && formEmer.value.emergencyImage) {
    editPosterType.value.title.length
      ? handleEditEmergency()
      : handleAddEmergency();
  } else if (
    formPoster.value.title &&
    formPoster.value.image &&
    !formDisplay.value.find(
      (e) =>
        (!e.MACaddress.length && !e.allDevice) ||
        !e.duration ||
        !e.startDate ||
        !e.endDate
    )
  ) {
    editPosterType.value.title.length ? handleEditPoster() : handleAddPoster();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: validateForm(),
      life: 3000,
    });
    loading.value = false;
  }
};

const isNextButtonDisabled = computed(() => {
  return !selectedPosterType.value.header;
});
const showDifferentDialog = () => {
  showUpload.value = false;
  if (selectedPosterType.value.code === "NP") {
    selectedPosterType.value = posterType.value[0];
  } else if (selectedPosterType.value.code === "EP") {
    selectedPosterType.value = posterType.value[1];
  }
  showSecondDialog.value = true;
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

  store.state.formDisplay.push(newInitialFormDisplay());
  const newSchedule = {
    header: `Schedule ${scheduleTabs.value.length + 1}`,
    index: scheduleTabs.value.length,
  };
  scheduleTabs.value.push(newSchedule);
  selectSchedule.value = scheduleTabs.value[scheduleTabs.value.length - 1];
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Add schedule successfully.",
    life: 3000,
  });
};

const deleteSchedule = (index: number) => {
  if (index >= 0 && index < scheduleTabs.value.length) {
    store.state.formDisplay.splice(index, 1);
    scheduleTabs.value.pop();
    if (scheduleTabs.value.length === index) {
      selectSchedule.value = scheduleTabs.value[scheduleTabs.value.length - 1];
    } else if (!(scheduleTabs.value.values.length - 1)) {
      selectSchedule.value = scheduleTabs.value[0];
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete schedule successfully.",
      life: 3000,
    });
  }
};

const nextStepUpload = () => {
  if (
    !formPoster.value.title ||
    formDisplay.value.find(
      (e) =>
        (!e.MACaddress.length && !e.allDevice) ||
        !e.duration ||
        !e.startDate ||
        !e.endDate
    )
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: validateForm(),
      life: 3000,
    });
  } else {
    let poster = [] as Poster[];
    if (editPosterType.value.type === "NP") {
      poster = posters.value.filter(
        (e) => e.posterId !== formPoster.value.posterId
      );
    } else {
      poster = posters.value;
    }
    let durationTime = [] as any;
    let filterTime = [] as Poster[];
    formDisplay.value.forEach((e, i) => {
      if (e.allDay) store.commit("setAllTime", i);
      if (e.allDevice) store.commit("setAllDevice", i);
    });
    formDisplay.value.forEach((form) => {
      const filterDate = poster.filter((all) => {
        return (
          (dateFormatter(form.startDate) <= dateFormatter(all.startDate) &&
            dateFormatter(all.startDate) <= dateFormatter(form.endDate)) ||
          (dateFormatter(form.startDate) <= dateFormatter(all.endDate) &&
            dateFormatter(all.endDate) <= dateFormatter(form.endDate)) ||
          (dateFormatter(all.startDate) <= dateFormatter(form.startDate) &&
            dateFormatter(form.startDate) <= dateFormatter(all.endDate))
        );
      });

      form.time.forEach((item) => {
        let date = new Date(
          form.startDate!.getFullYear(),
          form.startDate!.getMonth(),
          form.startDate!.getDate()
        );
        let count = 0;
        while (dateFormatter(date) <= dateFormatter(form.endDate!)) {
          form.MACaddress.forEach((e) => {
            durationTime.push({
              MACaddress: e,
              date: new Date(
                form.startDate!.getFullYear(),
                form.startDate!.getMonth(),
                form.startDate!.getDate() + count
              ),
              startTime: item.startTime,
              endTime: item.endTime,
              durationForm: form.duration,
              duration: 0,
            });
          });
          date!.setDate(date!.getDate() + 1);
          count++;
        }
        filterTime = filterDate.filter((all) => {
          return (
            (item.startTime!.toTimeString() <= all.startTime.toTimeString() &&
              all.startTime.toTimeString() <= item.endTime!.toTimeString()) ||
            (item.startTime!.toTimeString() <= all.endTime.toTimeString() &&
              all.endTime.toTimeString() <= item.endTime!.toTimeString()) ||
            (all.startTime.toTimeString() <= item.startTime!.toTimeString() &&
              item.startTime!.toTimeString() <= all.endTime.toTimeString())
          );
        });
      });
    });

    durationTime.forEach((form: any) => {
      filterTime.forEach((all) => {
        if (
          all.MACaddress === form.MACaddress &&
          dateFormatter(all.startDate) <= dateFormatter(form.date) &&
          dateFormatter(form.date) <= dateFormatter(all.endDate)
        ) {
          form.duration += all.duration * all.image.length;
        }
      });
    });

    let numImage = [] as number[];
    if (editPosterType.value.type == "NP") {
      numImage.push(formPoster.value.image.length);
    } else if (!formPoster.value.image) {
      store.state.formPoster.image = [];
    }

    durationTime.forEach((e: any) => {
      const endTimeSec =
        e.endTime.getHours() * 3600 + e.endTime.getMinutes() * 60;
      const startTimeSec =
        e.startTime.getHours() * 3600 + e.startTime.getMinutes() * 60;
      const num = (endTimeSec - startTimeSec - e.duration) / e.durationForm;
      numImage.push(Math.floor(num - (num * (0.5 / e.durationForm)) / 100));
    });
    maxImage.value = Math.min(...numImage);
    currentState.value = 1;
  }
};

const nextStepPreview = () => {
  if (formPoster.value.image) {
    selectRotate.value = { ...formPoster.value.image[0] };
    currentState.value = 2;
  } else {
    toast.add({
      severity: "error",
      summary: "Invalid",
      detail: "Image selected not found.",
      life: 3000,
    });
  }
};
</script>

<template>
  <Toast />
  <div>
    <Dialog
      v-model:visible="showUpload"
      modal
      close-on-escape
      :draggable="false"
      class="w-96"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
        },
        mask: {
          style: 'backdrop-filter: blur(2px)',
        },
      }"
    >
      <template #header>
        <div class="header-popup">Upload File</div>
      </template>
      <div class="flex flex-col gap-2">
        <div class="inline-block">
          <div>
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
              text
              label="Cancel"
              @click="showUpload = false"
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
      v-model:visible="showSecondDialog"
      :header="editPosterType.type ? 'Edit File' : 'Upload File'"
      modal
      close-on-escape
      :draggable="false"
      class="w-[600px]"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
        },
        mask: {
          style: 'backdrop-filter: blur(2px)',
        },
      }"
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

          <div class="flex flex-col items-end">
            <Dropdown
              v-model="selectSchedule"
              :options="scheduleTabs"
              optionLabel="header"
              class="w-full md:w-14rem mt-3"
            >
            </Dropdown>
            <Button
              v-if="selectSchedule.index"
              text
              class="bg-red-400 w-fit"
              @click="deleteSchedule(selectSchedule.index)"
            >
              <i class="pi pi-trash text-white"></i
            ></Button>
          </div>
          <ScheduleForm
            v-for="(schedule, index) in scheduleTabs"
            v-show="index === selectSchedule.index"
            :key="schedule.header"
            :index="index"
          />

          <div class="flex flex-row gap-4 pt-3">
            <Button
              text
              label="Add Schedule"
              :class="'secondaryButton'"
              @click="addSchedule"
            ></Button>
            <Button
              label="Next"
              @click="nextStepUpload()"
              :class="'primaryButton'"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 1">
          <div class="text-center text-red-500">Max Image: {{ maxImage }}</div>
          <UploadImage
            :posType="selectedPosterType.code"
            :maxImage="maxImage"
          />
          <div class="flex flex-row gap-4 pt-3">
            <Button
              text
              label="Back"
              :class="'secondaryButton'"
              @click="currentState = 0"
            ></Button>
            <Button
              label="Next"
              :class="'primaryButton'"
              @click="nextStepPreview()"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 2">
          <div class="flex justify-between">
            <div>
              <label
                class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
              >
                Orientation
              </label>
            </div>
            <div class="inline-flex gap-2">
              <Button
                @click="
                  async () => {
                    formPoster.image[selectRotate.priority - 1].image =
                      await rotate(selectRotate.image, -90);
                    selectRotate.image =
                      formPoster.image[selectRotate.priority - 1].image;
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
                    formPoster.image[selectRotate.priority - 1].image =
                      await rotate(selectRotate.image, -90);
                    selectRotate.image =
                      formPoster.image[selectRotate.priority - 1].image;
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
          <div class="orientOut">
            <div
              class="flex flex-row justify-center text-center items-center gap-3 mb-3"
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
                  :alt="formPoster.title"
                  :src="formPoster.image[selectRotate.priority - 1].image"
                  class="max-w-full max-h-full m-auto rotate-90"
                  :style="{
                    maxWidth: `${3840 / 20}px`,
                    maxHeight: `${2160 / 20}px`,
                  }"
                />
              </div>
            </div>
            <div
              v-for="(image, index) in formPoster.image"
              :key="index"
              class="content-image"
              @click="
                () => {
                  selectRotate = { ...formPoster.image[index] };
                }
              "
            >
              <img
                :alt="formPoster.title"
                :src="image.image"
                width="100%"
                height="100%"
              />
              <div class="text-image bg-[#8fff98]">Choose</div>
            </div>
          </div>
          <label
            class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1 mt-3"
          >
            Review
          </label>
          <Button
            text
            label="Back"
            :class="'secondaryButton'"
            @click="currentState = 1"
          ></Button>
          <Button
            label="Upload"
            :class="'primaryButton'"
            @click="uploadPoster"
          ></Button>
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
            <UploadImage
              :posType="selectedPosterType.code"
              :maxImage="undefined"
            />

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
            <Button
              label="Upload"
              :class="'primaryButtonEmer'"
              :loading="loading"
              @click="uploadPoster"
            ></Button>
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
  color: black;
}

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-right: 10px;
  margin-top: 20px;
  background-color: none;
  color: black;
  cursor: pointer;
  margin-right: 10px;
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
  margin-left: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: none;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: rgb(37, 135, 240);
  text-decoration-line: underline;
}

.primaryButtonEmer {
  width: 100%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: rgb(255, 120, 47);
  color: rgb(255, 255, 255);
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
  background-color: #ffffff;
  /* height: 50vh; */
  width: 100%;
  padding-top: 30px;
  padding-left: 26px;
  padding-right: 30px;
  padding-bottom: 80px;
  flex: 1 1;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PopupUpload",
});
</script>

<script setup lang="ts">
import store from "@/store";
import router from "@/router";
import { addEmergency, addPoster } from "@/services";
import { Poster } from "@/types";
import { useToast } from "primevue/usetoast";
import { computed, ref, reactive, watch } from "vue";
import {
  dateFormatter,
  createUnique,
  setFieldPoster,
  newInitialFormDisplay,
} from "@/utils/constant";
import ScheduleForm from "@/components/ScheduleForm.vue";
import UploadImage from "@/components/UploadImageCompo.vue";

const toast = useToast();
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
const posters = computed(() => store.state.posters);
const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const formEmer = computed(() => store.state.formEmer);
const currentDeg = ref(0);
const selectSchedule = ref(scheduleTabs[0]);
const showSecondDialog = ref(false);
const loading = ref(false);

watch([show, showSecondDialog], () => {
  if (show.value && !user.value.isAdmin) {
    selectedPosterType.value = posterType.value[0];
    show.value = false;
    showSecondDialog.value = true;
  } else if (!show.value && !showSecondDialog.value) {
    selectedPosterType.value = { header: "", code: "" };
    currentState.value = 0;
    store.commit("resetForm");
  }
});

const validateForm = () => {
  if (
    (selectedPosterType.value.code === "NP" && !formPoster.value.title) ||
    (selectedPosterType.value.code === "EP" && !formEmer.value.incidentName)
  ) {
    return "Title Invalid";
  }

  if (
    (selectedPosterType.value.code === "NP" && !formPoster.value.image) ||
    (selectedPosterType.value.code === "EP" && !formEmer.value.emergencyImage)
  ) {
    return "Not Choose File Image.";
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
  formDisplay.value.forEach((e, i) => {
    if (e.allDay) store.commit("setAllTime", i);
    if (e.allDevice) store.commit("setAllDevice", i);
  });
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

const add = async () => {
  loading.value = true;
  if (formEmer.value.incidentName && formEmer.value.emergencyImage) {
    handleAddEmergency();
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
    handleAddPoster();
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
    let durationTime = [] as any;
    let temp2 = [] as any;
    formDisplay.value.forEach((form, index) => {
      const temp = posters.value.filter((all) => {
        // filter date
        return (
          (dateFormatter(form.startDate) <= dateFormatter(all.startDate) &&
            dateFormatter(all.startDate) <= dateFormatter(form.endDate)) ||
          (dateFormatter(form.startDate) <= dateFormatter(all.endDate) &&
            dateFormatter(all.endDate) <= dateFormatter(form.endDate))
        );
      });

      form.time.forEach((item) => {
        durationTime.push({
          startDate: form.startDate,
          endDate: form.endDate,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: 0,
        });
        temp2 = temp.filter((all) => {
          return (
            (item.startTime!.toTimeString() <= all.startTime.toTimeString() &&
              all.startTime.toTimeString() <= item.endTime!.toTimeString()) ||
            (item.startTime!.toTimeString() <= all.endTime.toTimeString() &&
              all.endTime.toTimeString() <= item.endTime!.toTimeString())
          );
        });
      });
    });
    // durationTime.forEach((form: any) => {
    //   const time = temp2.filter((all: any) => {
    //     return (
    //       temp2.startTime.toTimeString() === form.startTime.toTimeString() &&
    //       temp2.endTime.toTimeString() === form.endTime.toTimeString() &&
    //       dateFormatter(temp2.startDate) === dateFormatter(form.startDate) &&
    //       dateFormatter(temp2.endDate) === dateFormatter(form.endDate)
    //     );
    //   });
    //   form.duration = time.reduce((prev: any, cur: any) => {
    //     return prev + cur.duration;
    //   }, 0);
    // });

    currentState.value = 1;
  }
};

// const preview = () => {};
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
      v-model:visible="showSecondDialog"
      header="Upload File"
      modal
      close-on-escape
      :draggable="false"
      class="w-[600px]"
    >
      <!-- <template v-if="user?.isAdmin" #header>
        <span
          style="font-weight: bold; color: rgb(94, 94, 94); font-size: 22px"
          >{{ selectedPosterType.header }}</span
        >
      </template> -->
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
              @click="nextStepUpload()"
              :class="'primaryButton'"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 1">
          <UploadImage :posType="selectedPosterType.code" />
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
                <!-- <Button
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
                /> -->
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
          <Button label="Upload" :class="'primaryButton'" @click="add"></Button>
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
            <UploadImage :posType="selectedPosterType.code" />

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
              @click="add"
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

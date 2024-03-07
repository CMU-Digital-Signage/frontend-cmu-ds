<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PopupUpload",
});
</script>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import store from "@/store";
import { addEmergency, addPoster, editEmergency, editPoster } from "@/services";
import { Poster } from "@/types";
import {
  dateFormatter,
  newInitialFormDisplay,
  rotate,
  timeFormatter,
} from "@/utils/constant";
import { useToast } from "primevue/usetoast";
import ScheduleForm from "@/components/ScheduleForm.vue";
import UploadImage from "@/components/UploadImageCompo.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const toast = useToast();
const limitCharTitle = ref(false);
const user = computed(() => store.state.userInfo);
const showUpload = computed({
  get: () => store.state.showUpload,
  set: (val) => (store.state.showUpload = val),
});
const uploadState = ref([
  { label: " Set Schedule" },
  { label: "Upload Content" },
  { label: "Orientation & Review" },
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
  () => store.state.formDisplay.length,
  () => {
    scheduleTabs.value = [];
    createScheduleTabs();
  },
  { deep: true }
);

watch([showUpload, showSecondDialog, editPosterType.value], () => {
  uploadState.value = editPosterType.value.title.length
    ? [{ label: "Set Schedule" }, { label: "Review" }]
    : [
        { label: "Set Schedule" },
        { label: "Upload Content" },
        { label: "Orientation & Review" },
      ];

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
    return "Title is empty";
  }

  if (
    selectedPosterType.value.code === "EP" &&
    !formEmer.value.emergencyImage
  ) {
    return "Image selected not found.";
  }

  // const invalidSchedule = formDisplay.value.find(
  //   (e) =>
  //     (!e.MACaddress.length && !e.allDevice) ||
  //     !e.duration ||
  //     !e.startDate ||
  //     !e.endDate
  // );

  // const invalidSchedule = formDisplay.value.find((e) => {
  //   if (!e.MACaddress.length && !e.allDevice) {
  //     return "Device is empty.";
  //   } else if (!e.duration) {
  //     return "Duration is empty.";
  //   } else if (!e.startDate) {
  //     return "startDate is empty.";
  //   } else if (!e.endDate) {
  //     return "endDate is empty.";
  //   }
  // });

  const invalidSchedule = formDisplay.value.reduce((errors: any, e) => {
    if (!e.startDate) {
      errors.push("Start Date is empty.");
    } else if (!e.endDate) {
      errors.push("End Date is empty.");
    } else if (!e.duration) {
      errors.push("Display Duration is empty.");
    } else if (!e.MACaddress.length && !e.allDevice) {
      errors.push("Device is empty.");
    }
    return errors;
  }, []);

  return invalidSchedule.join("\n");
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
      detail: "complete the current schedule before adding new ones.",
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
  } else if (posters.value) {
    let poster = [] as Poster[];
    if (editPosterType.value.type === "NP") {
      poster = posters.value.filter(
        (e) => e.posterId !== formPoster.value.posterId
      );
    } else {
      poster = posters.value;
    }
    const transition = 1;
    let durationTime = [] as any;
    let filterTime = [] as Poster[];
    formDisplay.value.forEach((e, i) => {
      if (e.allDay) store.commit("setAllTime", i);
      if (e.allDevice) store.commit("setAllDevice", i);
    });
    formDisplay.value.forEach((form) => {
      const filterDate = poster.filter((all) => {
        return (
          form.startDate &&
          form.endDate &&
          ((form.startDate.getTime() <= all.startDate.getTime() &&
            all.startDate.getTime() <= form.endDate.getTime()) ||
            (form.startDate.getTime() <= all.endDate.getTime() &&
              all.endDate.getTime() <= form.endDate.getTime()) ||
            (all.startDate.getTime() <= form.startDate.getTime() &&
              form.startDate.getTime() <= all.endDate.getTime()))
        );
      });

      form.time.forEach((item) => {
        let date = new Date(
          form.startDate!.getFullYear(),
          form.startDate!.getMonth(),
          form.startDate!.getDate()
        );
        let count = 0;
        while (date <= form.endDate!) {
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
            (item.startTime!.getTime() <= all.startTime.getTime() &&
              all.startTime.getTime() <= item.endTime!.getTime()) ||
            (item.startTime!.getTime() <= all.endTime.getTime() &&
              all.endTime.getTime() <= item.endTime!.getTime()) ||
            (all.startTime.getTime() <= item.startTime!.getTime() &&
              item.startTime!.getTime() <= all.endTime.getTime())
          );
        });
      });
    });

    durationTime.forEach((form: any) => {
      filterTime.forEach((all) => {
        if (
          all.MACaddress === form.MACaddress &&
          all.startDate.getTime() <= form.date.getTime() &&
          form.date.getTime() <= all.endDate.getTime()
        ) {
          form.duration += (all.duration + transition) * all.image.length;
        }
      });
    });

    let numImage = [] as number[];
    if (!formPoster.value.image) {
      store.state.formPoster.image = [];
    }

    durationTime.forEach((e: any) => {
      const endTimeSec =
        e.endTime.getHours() * 3600 + e.endTime.getMinutes() * 60;
      const startTimeSec =
        e.startTime.getHours() * 3600 + e.startTime.getMinutes() * 60;
      const range = endTimeSec - startTimeSec;
      const num = Math.floor(
        (range - (range / 1800) * 45 - e.duration) /
          (e.durationForm + transition)
      );
      numImage.push(num);
    });
    maxImage.value = Math.min(...numImage);
    if (!editPosterType.value.title.length) store.state.formPoster.image = [];
    currentState.value = 1;
  }
};

const nextStepPreview = () => {
  if (formPoster.value.image.length) {
    selectRotate.value = {
      image: formPoster.value.image[0].image.dataURL,
      priority: formPoster.value.image[0].priority,
    };
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
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
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
      modal
      :closable="!loading"
      close-on-escape
      :draggable="false"
      class="w-[800px] header-popup z-10"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; z-index: 10',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px;  z-index: 10',
        },
        mask: {
          style: 'backdrop-filter: blur(2px); z-index: 10',
        },
      }"
    >
      <template #header>
        <div class="header-popup">
          {{ editPosterType.type ? "Edit File" : "Upload File" }}
        </div>
      </template>
      <div v-if="selectedPosterType.code === 'NP'">
        <Steps class="mb-5" :model="uploadState" :active-step="currentState" />
        <div v-if="currentState === 0">
          <div class="inline-flex items-center">
            <label
              class="text-[#4e93f3] font-semibold text-[18px] flex justify-start mt-4 mb-1"
            >
              Title
            </label>
            <label class="text-[#FF0000] font-medium"> * </label>
          </div>
          <InputText
            v-model="formPoster.title"
            @keydown="limitCharTitle = formPoster?.title?.length >= 28"
            type="text"
            placeholder="Max 28 Character Ex.CPE Music Box"
            maxlength="28"
            class="title-input w-full mb-3 rounded-[12px]"
            :class="{
              'border-red-500 shadow-none':
                formPoster?.title?.length >= 28 && limitCharTitle,
            }"
          />
          <div
            v-if="formPoster?.title?.length >= 28 && limitCharTitle"
            class="text-red-500 -mt-2"
          >
            You have reached the character limit.
          </div>
          <label
            class="text-[#4e93f3] font-semibold text-[18px] flex justify-start mb-1"
          >
            Description
          </label>
          <InputText
            v-model="formPoster.description"
            class="description-input h-full w-full mb-5 rounded-[12px]"
            placeholder="(Optional)"
          />

          <div class="line-separator"></div>

          <div class="flex flex-inline items-end">
            <Dropdown
              v-model="selectSchedule"
              :options="scheduleTabs"
              optionLabel="header"
              class="w-full md:w-14rem mt-3 rounded-lg bg-blue-100 drop-shadow-lg border-2 border-blue-400 text-black font-medium"
            >
            </Dropdown>
            <Button
              v-if="selectSchedule.index"
              text
              class="bg-red-500 w-fit mt-1 ml-2 h-11 rounded-md"
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
        <div v-if="currentState === 1 && !editPosterType.title.length">
          <div class="text-center text-red-500">Maximum upload limit: {{ maxImage }} images</div>
          <div class="text-center text-blue-500 mb-2">
  Your uploaded content: {{ formPoster.image.length === 0 ? 'No images' : formPoster.image.length === 1 ? '1 image' : formPoster.image.length + ' images' }}
</div>

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
        <div
          v-if="
            currentState === 2 ||
            (currentState === 1 && editPosterType.title.length)
          "
        >
          <div v-if="!editPosterType.title.length">
            <div class="flex justify-between">
              <div>
                <label
                  class="text-[#282828] font-semibold text-[18px] flex justify-start mb-1"
                >
                  Orientation
                </label>
              </div>
            </div>
            <div class="orientOut border-2 border-black rounded-lg">
              <div class="inline-flex gap-2">
                <Button
                  @click="
                    async () => {
                      formPoster.image[
                        selectRotate.priority - 1
                      ].image.dataURL = await rotate(selectRotate.image, -90);
                      selectRotate.image =
                        formPoster.image[
                          selectRotate.priority - 1
                        ].image.dataURL;
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
                      formPoster.image[
                        selectRotate.priority - 1
                      ].image.dataURL = await rotate(selectRotate.image, 90);
                      selectRotate.image =
                        formPoster.image[
                          selectRotate.priority - 1
                        ].image.dataURL;
                    }
                  "
                  :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                  icon="pi pi-refresh"
                  rounded
                  outlined
                  :disabled="!formPoster.image"
                />
              </div>
              <div
                class="flex flex-row justify-center text-center items-center gap-3 mb-3"
              >
                <p>Logo TV</p>
                <div
                  class="flex justify-center border-2 border-black bg-black"
                  :style="{
                    width: `${2160 / 20}px`,
                    height: `${3840 / 20}px`,
                  }"
                >
                  <img
                    :alt="formPoster.title"
                    :src="
                      formPoster.image[selectRotate.priority - 1].image.dataURL
                    "
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
                :key="image.image.name"
                class="content-image"
                @click="
                  () => {
                    selectRotate = {
                      image: formPoster.image[index].image.dataURL,
                      priority: formPoster.image[index].priority,
                    };
                  }
                "
              >
                <img
                  :alt="image.image.name"
                  :src="image.image.dataURL"
                  width="100%"
                  height="100%"
                />
                <div class="text-image bg-[#9e9e9e]">Choose</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-5">
            <label
              class="text-[#282828] font-semibold text-[18px] flex justify-start mt-5 -mb-2"
            >
              Review
            </label>
            <div class="bg-[#e9f2fd] rounded-lg px-9 py-5">
              <div class="text-black-500 flex flex-col gap-1">
                <p class="font-semibold text-[#282828]">Title</p>
                <p class="font-notoThai">{{ formPoster.title }}</p>
              </div>
              <div class="text-black-500 flex flex-col gap-1 mt-3">
                <p class="font-semibold text-[#282828]">Description</p>
                <p class="font-notoThai">{{ formPoster.description || "-" }}</p>
              </div>
            </div>

            <DataTable
              :value="formDisplay"
              tableClass="b rounded-lg"
              class="overflow-hidden border-[1px] border-black-500 rounded-lg"
            >
              <Column header="Date" class="w-[160px]">
                <template #body="{ data }">
                  <span class="flex items-start justify-start">
                    {{ dateFormatter(data.startDate) }}
                    {{
                      dateFormatter(data.startDate) ===
                      dateFormatter(data.endDate)
                        ? ""
                        : ` - ${dateFormatter(data.endDate)}`
                    }}
                  </span>
                </template>
              </Column>

              <Column header="Time" class="w-[100px]">
                <template #body="{ data }">
                  <div v-if="data.allDay">
                    <td>All Day</td>
                  </div>
                  <div v-else>
                    <tr
                      v-for="(time, iTime) in data.time"
                      :key="iTime"
                      class="border-b- border-collapse"
                    >
                      <td>
                        {{ timeFormatter(time.startTime, false) }} -
                        {{ timeFormatter(time.endTime, false) }}
                      </td>
                    </tr>
                  </div>
                </template>
              </Column>

              <Column header="Display Duration" class="w-[40px]">
                <template #body="{ data }">
                  <td>{{ data.duration }}</td>
                </template>
              </Column>

              <Column header="Devices" class="w-[40px]">
                <template #body="{ data }">
                  <div v-if="data.allDevice">All</div>
                  <div v-else>
                    <tr
                      v-for="mac in data.MACaddress"
                      :key="mac"
                      class="border-b- border-collapse"
                    >
                      <td>
                        {{
                          store.state.devices?.find((e) => e.MACaddress === mac)
                            ?.deviceName
                        }}
                      </td>
                    </tr>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
          <div class="flex flex-inline gap-4 pt-3">
            <Button
              text
              label="Back"
              :loading="loading"
              :class="'secondaryButton'"
              @click="currentState = 1"
            ></Button>
            <Button
              label="Upload"
              :class="'primaryButton'"
              :loading="loading"
              @click="uploadPoster"
            ></Button>
          </div>
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
                class="description-input h-full font-notoThai"
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
  border-top: 3px solid #4e93f3;
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

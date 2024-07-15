<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ModalUpload",
});
</script>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import store from "@/store";
import {
  addEmergency,
  addPoster,
  editEmergency,
  editPoster,
  getIframe,
} from "@/services";
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
import Skeleton from "primevue/skeleton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import { CONTENT_CODE, MAP_TYPE } from "@/utils/enum";

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
const contentType = ref([
  {
    header: "Poster",
    code: CONTENT_CODE.Poster,
    icon: "images",
    disabled: false,
  },
  {
    header: "Video (Coming soon)",
    code: CONTENT_CODE.Video,
    icon: "video",
    disabled: true,
  },
  {
    header: "Website URL",
    code: CONTENT_CODE.Webview,
    icon: "link",
    disabled: false,
  },
  {
    header: "Emergency",
    code: "EP",
    icon: "exclamation-triangle",
    disabled: false,
  },
]);
const posters = computed(() => store.state.posters);
const editcontentType = computed(() => store.state.editPoster);
const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const formEmer = computed(() => store.state.formEmer);
const selectedContentType = ref({ header: "", code: "" });
const scheduleTabs = ref<{ header: string; index: number }[]>([
  { header: `Schedule 1`, index: 0 },
]);
const currentState = ref(0);
const maxImage = ref(0);
const selectRotate = ref({ image: "", priority: 1 });
const selectSchedule = ref({ header: `Schedule 1`, index: 0 });
const showSecondDialog = ref(false);
const loading = ref(false);
const loadingWebview = ref(false);

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

watch([showUpload, showSecondDialog, editcontentType.value], () => {
  if (editcontentType.value.code && showUpload.value) {
    selectedContentType.value = contentType.value.find(
      (e) => e.code == editcontentType.value.code
    )!;
    showUpload.value = false;
    showSecondDialog.value = true;
  } else if (showUpload.value && !user.value.isAdmin) {
    selectedContentType.value = contentType.value[0];
    showUpload.value = false;
    showSecondDialog.value = true;
  } else if (!showUpload.value && !showSecondDialog.value) {
    store.state.editPoster = { title: "", code: "" };
    selectedContentType.value = { header: "", code: "" };
    store.commit("resetForm");
  }
  currentState.value = 0;
});

const onIframeLoad = () => {
  loadingWebview.value = false;
};

const validateForm = () => {
  if (
    (selectedContentType.value.code !== "EP" && !formPoster.value.title) ||
    (selectedContentType.value.code === "EP" && !formEmer.value.incidentName)
  ) {
    return "Title is empty";
  }

  if (
    selectedContentType.value.code === "EP" &&
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
      summary: "Upload success",
      detail: "Emergency has been add successfully.",
      life: 3000,
    });
    showSecondDialog.value = false;
    store.commit("resetForm");
  } else {
    toast.add({
      severity: "error",
      summary: "Upload failed",
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
      summary: "Upload success",
      detail: `${formPoster.value.type} has been add successfully.`,
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
  const res = await editEmergency(editcontentType.value.title, formEmer.value);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Emergency content has been add successfully.",
      life: 3000,
    });
    showSecondDialog.value = false;
    store.commit("resetForm");
  } else {
    toast.add({
      severity: "error",
      summary: "Upload failed",
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
      summary: "Edit success",
      detail: `${formPoster.value.type} has been add successfully.`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Edit failed",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const uploadPoster = async () => {
  loading.value = true;
  if (formEmer.value.incidentName && formEmer.value.emergencyImage) {
    if (formEmer.value.emergencyImage.name) {
      formEmer.value.emergencyImage.name = `${
        formEmer.value.incidentName
      }.${formEmer.value.emergencyImage.name.split(".").pop()}`;
    }
    editcontentType.value.title.length
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
    editcontentType.value.title.length ? handleEditPoster() : handleAddPoster();
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
  return !selectedContentType.value.header;
});
const showDifferentDialog = () => {
  showUpload.value = false;
  if (selectedContentType.value.code === "NP") {
    store.state.formPoster.type = MAP_TYPE.POSTER;
    selectedContentType.value = contentType.value[0];
  } else if (selectedContentType.value.code === "VDO") {
    store.state.formPoster.type = MAP_TYPE.VIDEO;
    selectedContentType.value = contentType.value[1];
  } else if (selectedContentType.value.code === "WV") {
    store.state.formPoster.type = MAP_TYPE.WEBVIEW;
    selectedContentType.value = contentType.value[2];
  } else if (selectedContentType.value.code === "EP") {
    selectedContentType.value = contentType.value[3];
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
    if (editcontentType.value.code !== "EP") {
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
      if (selectedContentType.value.code === "WV") {
        store.state.formPoster.image = [{ image: "", priority: 1 }];
      }
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
    if (maxImage.value > 50) {
      maxImage.value = 50;
    }
    if (!editcontentType.value.title.length) {
      store.state.formPoster.image = [];
      if (selectedContentType.value.code === "WV") {
        store.state.formPoster.image = [{ image: "", priority: 1 }];
      }
    }
    currentState.value = 1;
  }
};

const nextStepPreview = async () => {
  let err = "";
  if (!formPoster.value.image.length) {
    err = `${
      selectedContentType.value.code === "NP" ? "Image" : "Video"
    } selected not found.`;
  } else if (
    formPoster.value.type == MAP_TYPE.WEBVIEW &&
    !formPoster.value.image[0].image.length
  ) {
    err = "URL is empty";
  }
  if (!err.length) {
    selectRotate.value = {
      priority: formPoster.value.image[0].priority,
    } as any;
    if (selectedContentType.value.code === "WV") {
      loading.value = true;
      const res = await getIframe(formPoster.value.image[0].image);
      if (res.ok) {
        loadingWebview.value = true;
        selectRotate.value.image = formPoster.value.image[0].image;
      } else {
        toast.add({
          severity: "error",
          summary: "Not allowed",
          detail: res.message,
          life: 3000,
        });
        loading.value = false;
        return;
      }
      loading.value = false;
    } else {
      selectRotate.value.image = formPoster.value.image[0].image.dataURL;
    }
    currentState.value = 2;
  } else {
    toast.add({
      severity: "error",
      summary: "Invalid",
      detail: err,
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
      class="w-[500px] h-fit font-sf-pro"
      :pt="{
        content: {
          style:
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;',
        },
        header: {
          style: 'border-top-left-radius: 20px; border-top-right-radius: 20px;',
        },
      }"
    >
      <template #header>
        <div class="header-popup text-[#049A7E]">Upload Content</div>
      </template>
      <div class="flex flex-col gap-2">
        <!-- <div>
            <label
              for="deviceName"
              class="flex justify-start font-semibold text-[14px] text-[#282828]"
            >
              Type of content
            </label>
          </div> -->
        <!-- <Dropdown
            v-model="selectedContentType"
            :options="contentType"
            optionLabel="header"
            option-disabled="disabled"
            placeholder="Select content"
            class="w-full md:w-14rem mt-2 h-10 flex items-center"
            :pt="{
              input: { class: 'text-[14px]' },
              item: (slotProps) => ({
                class: [
                  {
                    '!text-[#B2B2B2]': slotProps.context.disabled,
                    '!bg-[#FFD5D5]':
                      slotProps.context.focused &&
                      !slotProps.context.selected &&
                      slotProps.state.focusedOptionIndex == 3,
                    '!bg-[#FFB3B3]':
                      slotProps.context.selected &&
                      slotProps.context.index == 3,
                  },
                ],
              }),
            }"
          >
            <template #value="slotProps">
              <div
                v-if="slotProps.value.code"
                :class="`flex items-center ${
                  slotProps.value.code == 'EP' && 'text-[#FF4242]'
                }`"
              >
                <div>{{ slotProps.value.header }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <i :class="`mr-2 pi pi-${slotProps.option.icon}`" />
                <div>{{ slotProps.option.header }}</div>
              </div>
            </template>
          </Dropdown> -->
        <div
          v-for="type in contentType"
          :key="type.code"
          class="flex gap-4 items-center cursor-pointer px-4 py-2 rounded-xl"
          :class="{
            'bg-[#e5e5e5] text-[#a1a1a1] !cursor-not-allowed': type.disabled,
            'bg-[#FFEDD2] text-[#856F00]': type.code == CONTENT_CODE.Poster,
            'bg-[#E9E7FF] text-[#7054C1]': type.code == CONTENT_CODE.Video,
            'bg-[#C6EBFF] text-[#2E7DC5]': type.code == CONTENT_CODE.Webview,
            'bg-[#FFD7D7] text-[#D04A4A]': type.code == 'EP',
          }"
          @click="
            if (!type.disabled) {
              selectedContentType = type;
              showDifferentDialog();
            }
          "
        >
          <svg
            v-if="type.code == CONTENT_CODE.Poster"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="45"
            viewBox="0 0 35 32"
          >
            <g fill="currentColor">
              <path
                d="M1.5 28h26c.827 0 1.5-.673 1.5-1.5v-25c0-.827-.673-1.5-1.5-1.5h-26C.673 0 0 .673 0 1.5v25c0 .827.673 1.5 1.5 1.5M1 1.5a.5.5 0 0 1 .5-.5h26a.5.5 0 0 1 .5.5v25a.5.5 0 0 1-.5.5h-26a.5.5 0 0 1-.5-.5z"
              />
              <path
                d="M18 11c1.103 0 2-.897 2-2s-.897-2-2-2s-2 .897-2 2s.897 2 2 2m0-3a1.001 1.001 0 1 1-1 1c0-.551.448-1 1-1"
              />
              <path
                d="M3.5 23h22a.5.5 0 0 0 .5-.5v-19a.5.5 0 0 0-.5-.5h-22a.5.5 0 0 0-.5.5v19a.5.5 0 0 0 .5.5m.5-1v-4.638c.022-.016.047-.025.067-.045l5.116-5.116a.704.704 0 0 1 .972 0l7.521 7.521a.498.498 0 0 0 .699.008l3.866-3.672a.684.684 0 0 1 .486-.202c.184 0 .355.072.464.178L25 18.093V22zM25 4v12.581l-1.081-1.228a1.67 1.67 0 0 0-1.191-.495h-.001a1.67 1.67 0 0 0-1.185.486l-3.504 3.328l-7.176-7.177c-.639-.638-1.749-.637-2.386 0L4 15.971V4z"
              />
              <path
                d="M4.5 29.083a.5.5 0 0 0-.5.5v.917c0 .827.673 1.5 1.5 1.5h26c.827 0 1.5-.673 1.5-1.5v-26c0-.827-.673-1.5-1.5-1.5h-.917a.5.5 0 0 0 0 1h.917a.5.5 0 0 1 .5.5v26a.5.5 0 0 1-.5.5h-26a.5.5 0 0 1-.5-.5v-.917a.5.5 0 0 0-.5-.5"
              />
            </g>
          </svg>
          <svg
            v-else-if="type.code == CONTENT_CODE.Video"
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="40"
            viewBox="0 0 37 32"
          >
            <g fill="currentColor">
              <path
                d="M7.5 0h-6C.631 0 0 .631 0 1.5v29c0 .869.631 1.5 1.5 1.5h34c.869 0 1.5-.631 1.5-1.5v-29c0-.869-.631-1.5-1.5-1.5zM1 30.5v-29c0-.313.187-.5.5-.5H7v30H1.5c-.313 0-.5-.187-.5-.5m7 .5V1h21v30zM36 1.5v29c0 .313-.187.5-.5.5H30V1h5.5c.313 0 .5.187.5.5"
              />
              <path
                d="M14.777 10.084a.502.502 0 0 0-.514-.025a.502.502 0 0 0-.263.441v12a.5.5 0 0 0 .777.416l9-6a.501.501 0 0 0 0-.832zM15 21.566V11.434l7.599 5.066zM5 8H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1M3 5h2a.5.5 0 0 0 0-1H3a.5.5 0 0 0 0 1m2 7H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1m0 4H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1m0 4H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1m0 4H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1m0 4H3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1M32 9h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m0-4h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m0 8h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m0 4h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m0 4h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m0 4h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1m2 3h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1"
              />
            </g>
          </svg>
          <svg
            v-else-if="type.code == CONTENT_CODE.Webview"
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="32"
            viewBox="0 0 33 32"
          >
            <g fill="currentColor">
              <path
                d="M18.986 16.471a4.596 4.596 0 0 0 3.748-1.331l7.405-7.405a4.585 4.585 0 0 0 1.356-3.231a4.478 4.478 0 0 0-1.316-3.222a4.473 4.473 0 0 0-3.188-1.317h-.033a4.587 4.587 0 0 0-3.23 1.356l-7.405 7.405a4.601 4.601 0 0 0-1.269 4.157a.536.536 0 0 0 1.049-.209a3.53 3.53 0 0 1 .976-3.192l7.405-7.405a3.521 3.521 0 0 1 2.482-1.043c.975 0 1.805.35 2.458 1.003s1.01 1.527 1.004 2.458a3.525 3.525 0 0 1-1.044 2.482l-7.405 7.405a3.546 3.546 0 0 1-2.879 1.024a.538.538 0 0 0-.588.475a.534.534 0 0 0 .474.59m-3.846 6.802a4.57 4.57 0 0 0 1.229-4.334a.53.53 0 0 0-.646-.394a.534.534 0 0 0-.394.645a3.51 3.51 0 0 1-.946 3.328l-7.405 7.405a3.521 3.521 0 0 1-2.482 1.043a3.373 3.373 0 0 1-2.458-1.003a3.413 3.413 0 0 1-1.003-2.458a3.528 3.528 0 0 1 1.043-2.483l7.405-7.405a3.516 3.516 0 0 1 2.906-1.021a.546.546 0 0 0 .592-.471a.536.536 0 0 0-.471-.592a4.592 4.592 0 0 0-3.783 1.327l-7.405 7.405a4.589 4.589 0 0 0-1.356 3.231a4.478 4.478 0 0 0 1.316 3.222c.85.85 1.98 1.317 3.188 1.317h.033a4.587 4.587 0 0 0 3.23-1.356z"
              />
              <path
                d="M22.734 8.872a.534.534 0 0 0-.756 0l-13.5 13.5a.534.534 0 1 0 .756.756l13.5-13.5a.534.534 0 0 0 0-.756"
              />
            </g>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="40"
            viewBox="0 0 35 32"
          >
            <g fill="currentColor">
              <path
                d="M21.799 2.954C20.694 1.05 19.19 0 17.564 0c-1.626 0-3.131 1.05-4.236 2.954L1.059 24.087c-1.12 1.947-1.24 3.969-.33 5.546c.866 1.5 2.565 2.363 4.664 2.367h24.342c2.102-.004 3.804-.864 4.667-2.361c.905-1.567.783-3.581-.335-5.525zm11.738 26.185c-.681 1.18-2.067 1.858-3.804 1.861H5.394c-1.731-.003-3.115-.684-3.799-1.867c-.727-1.26-.606-2.917.33-4.546L14.193 3.456C15.112 1.872 16.309 1 17.564 1s2.452.872 3.37 2.456l12.268 21.157c.935 1.626 1.057 3.276.335 4.526"
              />
              <path
                d="M17.564 20a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-1 0v10a.5.5 0 0 0 .5.5m-.064 2.5c-1.103 0-2 .897-2 2s.897 2 2 2s2-.897 2-2s-.897-2-2-2m0 3a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2"
              />
            </g>
          </svg>
          <div>
            <p class="text-[12px] font-semibold">{{ type.header }}</p>
            <p class="text-[10px]">
              {{
                type.code == CONTENT_CODE.Poster
                  ? "Static image to display as a poster. Ideal for event announcements, advertisements, or informational content."
                  : type.code == CONTENT_CODE.Video
                  ? "Video file to play on the screen. Suitable for promotional videos, tutorials, or engaging visual content."
                  : type.code == CONTENT_CODE.Webview
                  ? "Enter a URL to display a webpage. Perfect for live content or interactive websites."
                  : "Emergency file or provide content to be displayed immediately on all screens in case of an emergency situation."
              }}
            </p>
          </div>
          <i class="pi pi-chevron-right"></i>
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
            'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; z-index: 10;  ',
        },
        header: {
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px;   z-index: 10; ',
        },
      }"
    >
      <template #header>
        <div class="flex flex-col">
          <div
            :class="`header-popup ${
              selectedContentType.code === 'EP' ? '!text-[#FF4D4D]' : ''
            }`"
          >
            {{ editcontentType.code ? "Edit Content" : "Upload Content" }}
          </div>
          <div class="text-[14px] font-thin text-[#828282]">
            {{ selectedContentType.header }} Content
          </div>
        </div>
      </template>
      <div v-if="selectedContentType.code !== 'EP'">
        <Steps
          :pt="{
            step: { class: `bg-[#14C6A4] text-white` },
          }"
          class="mb-5"
          :model="uploadState"
          :active-step="currentState"
        />
        <div v-if="currentState === 0">
          <div flex flex-col gap-1>
            <div
              class="bg-white p-2 px-4 rounded-lg items-start justify-start"
              style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
            >
              <div class="inline-flex items-center">
                <label
                  class="text-black font-semibold text-[14px] flex justify-start mt-4 mb-1"
                >
                  Title
                </label>
                <label class="font-medium text-red-500"> * </label>
              </div>
              <InputText
                v-model="formPoster.title"
                @keydown="limitCharTitle = formPoster?.title?.length >= 28"
                type="text"
                placeholder="Max 28 Character Ex.CPE Music Box"
                maxlength="28"
                class="h-8 w-full mb-3 rounded-[8px] text-[12px]"
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
                class="text-black font-semibold text-[14px] flex justify-start mb-1"
              >
                Description
              </label>
              <InputText
                v-model="formPoster.description"
                class="h-8 w-full mb-3 rounded-[8px] text-[12px]"
                placeholder="(Optional)"
              />
            </div>

            <div
              class="bg-white px-4 p-2 rounded-lg mt-5 h-fit"
              style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
            >
              <div class="flex flex-inline items-end h-10">
                <label
                  class="text-black font-semibold text-[14px] items-center flex justify-start mb-2 mr-5"
                >
                  Schedule
                </label>

                <Dropdown
                  v-model="selectSchedule"
                  :options="scheduleTabs"
                  optionLabel="header"
                  class="w-full hover:border-[#14C6A4] focus:border-[#14C6A4] md:w-14rem mt-3 h-10 rounded-md drop-shadow-sm border-2 text-black font-medium"
                  :pt="{
                    input: {
                      class: ` text-[14px] font-sf-pro`,
                    },
                    item: {
                      class: `text-[14px] focus-visible:color-white`, //แก้ให้เป็น color white
                    },
                  }"
                >
                </Dropdown>

                <Button
                  v-if="selectSchedule.index"
                  text
                  class="flex items-center justify-center w-8 h-8 ml-2 mb-1 rounded-lg bg-[#ff6961] border-[#ff6961] hover:bg-[#ed5a52]"
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
            </div>
          </div>

          <div class="flex flex-row gap-4 pt-3">
            <Button
              text
              label="Add Schedule"
              icon="pi pi-plus"
              :class="'secondaryButton justify-center'"
              @click="addSchedule"
              :pt="{ label: { class: 'flex-none ml-2' } }"
            ></Button>
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              @click="nextStepUpload()"
              :class="'primaryButton  justify-center '"
              iconPos="right"
              :pt="{ label: { class: 'flex-none mr-2' } }"
            ></Button>
          </div>
        </div>

        <div v-if="currentState === 1">
          <div
            v-if="
              [CONTENT_CODE.Poster, CONTENT_CODE.Video].includes(
                selectedContentType.code as CONTENT_CODE
              )
            "
          >
            <div class="bg-[#f2f2f2] p-2 px-4 rounded-lg justify-center mb-3">
              <div class="text-[14px] text-center mt-2 text-red-500">
                Upload limit: {{ maxImage }} contents
              </div>
              <div class="text-[14px] text-center text-[#41b8a2] mb-2">
                Uploaded content:
                {{
                  formPoster.image?.length === 0
                    ? "No images"
                    : formPoster.image?.length === 1
                    ? "1 image"
                    : formPoster.image?.length + " contents"
                }}
              </div>
            </div>

            <UploadImage
              :posType="selectedContentType.code"
              :maxImage="maxImage"
            />
          </div>

          <div
            v-else-if="selectedContentType.code === CONTENT_CODE.Webview"
            class="bg-white p-2 px-4 rounded-lg items-start justify-start"
            style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
          >
            <div class="inline-flex items-center">
              <label
                class="text-black font-semibold text-[14px] flex justify-start mt-2 mb-2"
              >
                Upload Website URL
              </label>
              <label class="font-medium text-red-500"> * </label>
            </div>
            <div class="text-[12px] text-[#14c6a4] -mt-1 mb-3">
              Note: Some websites may not be displayed due to website security
              restrictions.
            </div>
            <InputText
              v-model="formPoster.image[0].image"
              type="url"
              placeholder="https://"
              class="h-8 w-full mb-3 rounded-[8px] text-[12px]"
            />
          </div>
          <div class="flex flex-row gap-4 pt-3">
            <Button
              text
              label="Back"
              :class="'secondaryButton'"
              @click="currentState = 0"
            ></Button>
            <Button
              :loading="loading"
              label="Next"
              icon="pi pi-arrow-right "
              :class="'primaryButton  justify-center '"
              iconPos="right"
              :pt="{ label: { class: 'flex-none mr-2' } }"
              @click="nextStepPreview()"
            ></Button>
          </div>
        </div>
        <div v-if="currentState === 2">
          <!-- Orientation -->
          <label
            class="text-[#282828] font-semibold text-[14px] flex justify-start mb-1"
          >
            Orientation (Portrait, Logo TV the left side of the screen)
          </label>
          <div
            class="orientOut border-2 rounded-lg flex flex-col gap-5 bg-white"
            style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
          >
            <div
              class="flex flex-row items-start justify-start overflow-hidden max-h-[430px] h-fit"
            >
              <div class="w-full flex justify-center items-center">
                <div
                  class="flex flex-col items-end justify-end w-fit gap-6 px-5 bg-white rounded-lg"
                >
                  <div
                    class="flex flex-row justify-center text-center items-center gap-3 w-full"
                  >
                    <p class="text-[14px] text-[#575757]">Logo<br />TV</p>
                    <div
                      class="flex items-center justify-center bg-[#282828] border-[#D3D1D1] rounded-md shadow-md"
                      :style="{
                        width: `${2160 / 11}px`,
                        height: `${3840 / 11}px`,
                      }"
                    >
                      <div
                        class="flex justify-center bg-black shadow-sm shadow-slate-600 rounded-md"
                        :style="{
                          width: `${2160 / 12}px`,
                          height: `${3840 / 12}px`,
                        }"
                      >
                        <div
                          v-if="selectedContentType.code === 'WV'"
                          class="flex-1 overflow-hidden relative"
                        >
                          <Skeleton
                            v-if="loadingWebview"
                            width="100%"
                            height="100%"
                          />
                          <iframe
                            v-show="!loadingWebview"
                            :title="formPoster.title"
                            :src="`${formPoster.image[0].image}`"
                            :width="`${2160 / 2}px`"
                            :height="`${3840 / 2}px`"
                            scrolling="no"
                            fullScreen="true"
                            @load="onIframeLoad"
                            class="absolute top-0 left-0 overflow-hidden pointer-events-none"
                            style="
                              transform: scale(0.167);
                              transform-origin: 0 0;
                            "
                          />
                        </div>
                        <img
                          v-else
                          :alt="formPoster.title"
                          :src="
                            formPoster.image[selectRotate.priority - 1].image
                              .dataURL
                          "
                          class="max-w-full max-h-full m-auto rotate-90"
                          :style="{
                            maxWidth: `${3840 / 12}px`,
                            maxHeight: `${2160 / 12}px`,
                          }"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedContentType.code === 'NP'"
                    class="inline-flex gap-4 justify-center w-[196px]"
                  >
                    <Button
                      @click="
                        async () => {
                          formPoster.image[
                            selectRotate.priority - 1
                          ].image.dataURL = await rotate(
                            selectRotate.image,
                            -90
                          );
                          selectRotate.image =
                            formPoster.image[
                              selectRotate.priority - 1
                            ].image.dataURL;
                        }
                      "
                      class="bg-white border-[#0FAB8D] hover:bg-[#0FAB8D] hover:bg-opacity-15 w-12 h-12"
                      :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                      rounded
                      outlined
                      :disabled="!formPoster.image"
                    >
                      <template v-slot:icon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="23"
                          viewBox="0 0 17 19"
                          fill="none"
                        >
                          <path
                            d="M11.6639 4.93987C12.1409 5.29747 12.6343 5.15464 12.6343 4.52594V3.43683H12.658C14.3836 3.43683 15.4727 4.62976 15.4727 6.33128C15.4727 7.38883 15.147 7.78681 15.1233 8.07283C15.1151 8.2954 15.1945 8.43078 15.3777 8.51831C15.624 8.6374 15.9104 8.52612 16.0454 8.2954C16.2921 7.87401 16.4668 7.1744 16.4668 6.32347C16.4668 4.04924 14.9482 2.51431 12.6658 2.51431H12.6339V1.34547C12.6339 0.70151 12.1487 0.558331 11.6639 0.924081L9.49314 2.51431C9.12739 2.78472 9.12739 3.09483 9.49314 3.35744L11.6639 4.93987ZM2.57477 18.4424H10.4554C11.8149 18.4424 12.4989 17.7903 12.4989 16.3986V8.53392C12.4989 7.14251 11.8149 6.4904 10.4554 6.4904H2.57477C1.21491 6.4904 0.53125 7.14251 0.53125 8.53392V16.3986C0.53125 17.7903 1.21491 18.4424 2.57477 18.4424ZM2.59852 17.162C2.05804 17.162 1.81138 16.9394 1.81138 16.3748V8.55767C1.81138 7.99344 2.05804 7.77053 2.59852 7.77053H10.4313C10.9799 7.77053 11.2184 7.99344 11.2184 8.55767V16.3748C11.2184 16.9394 10.9799 17.162 10.4313 17.162H2.59852Z"
                            fill="#0FAB8D"
                          />
                        </svg>
                      </template>
                    </Button>
                    <Button
                      @click="
                        async () => {
                          formPoster.image[
                            selectRotate.priority - 1
                          ].image.dataURL = await rotate(
                            selectRotate.image,
                            90
                          );
                          selectRotate.image =
                            formPoster.image[
                              selectRotate.priority - 1
                            ].image.dataURL;
                        }
                      "
                      class="bg-white border-[#0FAB8D] hover:bg-[#0FAB8D] hover:bg-opacity-15 w-12 h-12"
                      :class="`${formPoster.image ? '' : 'text-[#9c9b9b]'}`"
                      rounded
                      outlined
                      :disabled="!formPoster.image"
                    >
                      <template v-slot:icon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="23"
                          viewBox="0 0 17 19"
                          fill="none"
                        >
                          <path
                            d="M5.33611 4.93987C4.85907 5.29747 4.36575 5.15464 4.36575 4.52594V3.43683H4.342C2.61639 3.43683 1.52728 4.62976 1.52728 6.33128C1.52728 7.38883 1.853 7.78681 1.87675 8.07283C1.88489 8.2954 1.8055 8.43078 1.62228 8.51831C1.37596 8.6374 1.08961 8.52612 0.95457 8.2954C0.707909 7.87401 0.533177 7.1744 0.533177 6.32347C0.533177 4.04924 2.05182 2.51431 4.3342 2.51431H4.36609V1.34547C4.36609 0.70151 4.85127 0.558331 5.33611 0.924081L7.50686 2.51431C7.87261 2.78472 7.87261 3.09483 7.50686 3.35744L5.33611 4.93987ZM14.4252 18.4424H6.54464C5.18512 18.4424 4.50112 17.7903 4.50112 16.3986V8.53392C4.50112 7.14251 5.18512 6.4904 6.54464 6.4904H14.4252C15.7851 6.4904 16.4688 7.14251 16.4688 8.53392V16.3986C16.4688 17.7903 15.7851 18.4424 14.4252 18.4424ZM14.4015 17.162C14.942 17.162 15.1886 16.9394 15.1886 16.3748V8.55767C15.1886 7.99344 14.942 7.77053 14.4015 7.77053H6.56873C6.02011 7.77053 5.78159 7.99344 5.78159 8.55767V16.3748C5.78159 16.9394 6.02011 17.162 6.56873 17.162H14.4015Z"
                            fill="#0FAB8D"
                          />
                        </svg>
                      </template>
                    </Button>
                  </div>
                </div>
              </div>

              <div
                v-if="selectedContentType.code !== 'EP'"
                class="border-[2px] border-[#D9D9D9] grid grid-cols-3 gap-2 p-2 justify-center rounded-xl w-full max-h-full min-h-full overflow-auto"
              >
                <div
                  v-for="(image, index) in formPoster.image"
                  :key="image.image.name"
                  class="content-image !w-[100px] !h-[100px]"
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
          </div>
          <!-- Review -->
          <label
            class="text-[#282828] font-semibold mt-3 text-[14px] flex justify-start"
          >
            Review
          </label>
          <div
            class="flex flex-col gap-5 bg-white rounded-lg p-[16px] items-start justify-start mt-2 mb-6"
            style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
          >
            <div class="bg-[#e9f2fd] rounded-xl px-9 py-5 w-full">
              <div class="font-sf-pro text-black-500 flex flex-col gap-1">
                <p class="text-[16px] font-semibold">{{ formPoster.title }}</p>
                <p class="text-[12px]">
                  Description:
                  <span class="font-normal">{{
                    formPoster.description || "-"
                  }}</span>
                </p>
              </div>
            </div>

            <DataTable
              :value="formDisplay"
              class="border-[1px] border-gray rounded-lg text w-full"
              :pt="{
                column: {
                  headerContent: { class: `!text-[12px]` },
                  bodyCell: { class: `!text-[12px]` },
                },
                bodyRow: {
                  class: `!h-[10px]`,
                },
              }"
            >
              <Column header="Date" class="w-[120px]">
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
                      class="border-collapse"
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
          <!-- Button Back & Next -->
          <div class="flex flex-inline gap-4 pt-3">
            <Button
              text
              label="Back"
              :loading="loading"
              :class="'secondaryButton'"
              @click="currentState = 1"
            ></Button>
            <Button
              :label="editcontentType.code ? 'Done' : 'Upload'"
              :icon="editcontentType.code ? '' : 'pi pi-upload'"
              :class="'primaryButton justify-center'"
              :loading="loading"
              :pt="{ label: { class: 'flex-none ml-2' } }"
              @click="uploadPoster"
            ></Button>
          </div>
        </div>
      </div>

      <div v-else-if="selectedContentType.code === 'EP'">
        <div class="flex flex-row justify-between gap-3 mx-1">
          <div class="flex flex-col justify-start w-full max-w-4xl">
            <div class="inline-flex items-center">
              <label
                class="text-black font-semibold text-[14px] flex justify-start mt-4 mb-1"
              >
                Title
              </label>
              <label class="font-medium text-red-500"> * </label>
            </div>
            <InputText
              v-model="formEmer.incidentName"
              type="text"
              placeholder="Ex. Gas leakage"
              class="title-input mb-3 text-[12px]"
            />
            <!-- File Upload -->
            <UploadImage
              :posType="selectedContentType.code"
              :maxImage="undefined"
            />

            <!-- Description -->
            <div class="flex flex-col gap-1 w-full">
              <label
                for="Description"
                class="text-black font-semibold text-[14px] flex justify-start mt-4 mb-1"
                >Description</label
              >
              <InputText
                v-model="formEmer.description"
                type="text"
                placeholder="(optional)"
                class="description-input h-full font-notoThai text-[12px]"
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

  background-color: #a0dbfb;
}

.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: #049a7e;
}

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 14px;
  margin-top: 20px;
  background-color: none;
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
  background-color: #14c6a4;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: #0eb092;
}

.primaryButtonEmer {
  width: 100%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: #0eb092;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButtonEmer:hover {
  cursor: pointer;
  background-color: rgb(255, 233, 228);
}

.orientOut {
  background-color: #ffffff;
  /* height: 50vh; */
  width: 100%;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  flex: 1 1;
}
</style>

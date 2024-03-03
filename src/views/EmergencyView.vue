<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch, watchEffect } from "vue";
import store from "@/store";
import {
  activateEmergency,
  deactivateEmergency,
  editEmergency,
  getEmergency,
} from "@/services";
import TextPoster from "@/components/TextPoster.vue";
import { Emergency } from "@/types";
import { useToast } from "primevue/usetoast";

const emerPosters = computed(() => store.state.emerPosters);
const selectEmer = ref({ incidentName: "", emergencyImage: "" } as Emergency);
const password = ref("");
const toast = useToast();
const loading = ref(false);

const getTextPoster = (e: any) => {
  selectEmer.value.emergencyImage = e.target.value;
};

const processText = (text: any) => {
  if (!text) {
    return "";
  }

  let processedText = "";
  let charCount = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      processedText += text[i];
      charCount = 0;
    } else {
      processedText += text[i];
      charCount++;
    }
    if (charCount === 32) {
      processedText += "\n";
      charCount = 0;
    }
  }

  return processedText;
};
const checkNumOfRows = (e: any) => {
  const text = e.target.value;
  const processedText = processText(text);

  const lines = processedText.split("\n");
  const numberOfLines = lines.length;

  if (numberOfLines >= 13) {
    e.target.maxLength = 0;
  } else {
    e.target.maxLength = 312;
  }

  if (numberOfLines === 12 && e.key === "Enter") {
    e.preventDefault();
  }
};

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

watchEffect(() => {
  const activeEmer = emerPosters.value.find(
    (e: Emergency) => e.status === "Active"
  );
  if (activeEmer) {
    selectEmer.value = activeEmer;
  }
});

const handleEmergency = async () => {
  loading.value = true;
  if (selectEmer.value.status === "Active") {
    const res = await deactivateEmergency(
      selectEmer.value.incidentName,
      password.value
    );
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: `${selectEmer.value.incidentName} has been Deactivate.`,
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
  } else {
    let res;
    if (selectEmer.value.incidentName === "banner") {
      res = await editEmergency("banner", selectEmer.value, password.value);
    } else {
      res = await activateEmergency(
        selectEmer.value.incidentName,
        password.value
      );
    }
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: `${selectEmer.value.incidentName} has been activate.`,
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
  }
  loading.value = false;
};
</script>

<template>
  <div class="rectangleOut flex md:flex-row flex-col md:gap-0">
    <Toast />
    <div
      class="pt-[12px] pb-[32px] px-[20px] flex flex-1 flex-col text-left justify-between md:gap-0 gap-5"
    >
      <div v-if="!emerPosters.find((e) => e.status === 'Active')">
        <div
          class="flex flex-row px-4 py-2 lg:px-5 mb-6 gap-7 bg-[#ffe5e5] rounded-lg h-20 items-center"
        >
          <div class="w-8 h-8 flex items-center justify-center rounded-full">
            <i
              class="pi pi-exclamation-triangle mb-1 text-red-500 text-3xl"
            ></i>
          </div>

          <div class="md:text-[16px] text-[13px]">
            <p class="font-bold text-red-500">
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
            <p class="md:text-[16px] text-[14px] font-semibold mb-2">
              Choose Poster to displayed
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-40 overflow-y-scroll"
            >
              <div class="grid grid-cols-2 gap-y-10 md:p-8 p-5 pt-9">
                <div
                  v-for="category in emerPosters.filter(
                    (e) => e.incidentName !== 'banner'
                  )"
                  :inputId="category.incidentName"
                  :key="category.incidentName"
                  class="flex md:text-[16px] text-[14px] gap-2 items-center h-1"
                >
                  <RadioButton v-model="selectEmer" :value="category" />
                  <label :for="category.incidentName" class="ml-2">{{
                    category.incidentName
                  }}</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="md:text-[16px] text-[14px] font-semibold mb-2">
              Type text to display banner
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-48"
            >
              <div class="flex flex-col gap-3 md:mx-8 my-5 mx-5">
                <div class="flex gap-2 items-center">
                  <RadioButton
                    :value="
                      emerPosters.find((e) => e.incidentName === 'banner')
                    "
                    v-model="selectEmer"
                  />
                  <label :for="'Banner'">Banner</label>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <Textarea
                    @keydown="checkNumOfRows"
                    :disabled="selectEmer.incidentName !== 'banner'"
                    @input="getTextPoster"
                    :maxlength="312"
                    placeholder="Ex: There's a fire, do not use the elevator"
                    class="md:text-[16px] text-[14px] font-notoThai border-[2px] border-[#DBDBDB] p-3 rounded-lg h-[110px] bg-none resize-none disabled:text-[#8E8A8A]"
                  ></Textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-1 justify-center items-center">
        {{ selectEmer.incidentName }} has been Activate.
      </div>
      <div v-if="selectEmer">
        <p class="md:text-[17px] text-[14px] font-semibold mb-2">
          Type your Emergency Password in the box below
        </p>
        <div class="flex flex-col">
          <Password
            class="w-full mb-2"
            v-model="password"
            input-class="w-full rounded-[12px] border-2"
            :feedback="false"
            toggle-mask
            @keypress="
              (e) => {
                if (e.key === 'Enter') handleEmergency();
              }
            "
          ></Password>

          <Button
            class="w-full rounded-lg border-0"
            :class="{
              'bg-red-500': selectEmer.status !== 'Active',
              'bg-black opacity-80': selectEmer.status === 'Active',
            }"
            :disabled="!password.length || !selectEmer.emergencyImage.length"
            :loading="loading"
            :label="selectEmer.status === 'Active' ? 'Deactivate' : 'Activate'"
            @click="handleEmergency()"
          ></Button>
        </div>
      </div>
    </div>

    <div
      class="flex-1 border-l-[2px]; border-[#eaeaea] pt-[12px] pb-[32px] px-[20px] flex flex-col"
    >
      <div
        class="w-full h-full overflow-y-scroll rounded-xl border-[3px] border-black-300 bg-[#ffffff] flex items-center justify-center"
      >
        <div
          v-if="selectEmer.incidentName"
          class="w-11/12 h-full flex items-center justify-center"
        >
          <img
            v-if="selectEmer.incidentName !== 'banner'"
            class="m-auto w-full transition-opacity rotated-image"
            :src="selectEmer.emergencyImage"
            alt="poster-image"
          />
          <div v-else>
            <TextPoster :text="selectEmer.emergencyImage" />
          </div>
        </div>
        <div v-else>Preview Poster</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangleOut {
  overscroll-behavior-y: contain;
  overflow: hidden;
  flex: 1 1;
}

.rotated-image {
  transform: rotate(90deg);
}

.rectangleLeftIn {
  background-color: #ffffff;
  height: 10vh;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 30px;
  overflow-y: scroll;
  flex: 1 1;
}

.rectangleRightIn {
  background-color: #642121;
  height: 10vh;
  border-radius: 18px;
  overflow-y: hidden;
  flex: 1 1;
}
</style>

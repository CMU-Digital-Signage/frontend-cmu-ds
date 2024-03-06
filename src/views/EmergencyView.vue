<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
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
const loading1st = ref(false);
const checkTextRow = ref(false);

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
    checkTextRow.value = false;
  }

  if (numberOfLines === 12 && e.key === "Enter") {
    checkTextRow.value = true;
    e.preventDefault();
  }
};

onMounted(async () => {
  if (!emerPosters.value) {
    loading1st.value = true;
    const res = await getEmergency();
    if (res.ok) {
      res.emergency.forEach((e: Emergency) => e.status === "Active");
      store.state.emerPosters = res.emergency;
    }
    loading1st.value = false;
  }
});

watchEffect(() => {
  const activeEmer = emerPosters.value?.find(
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
        detail: res.message,
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
      selectEmer.value.status = true;
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
        detail: res.message,
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
  <div class="rectangleOut flex md:flex-row flex-col md:gap-0 font-sf-pro">
    <Toast />
    <Skeleton
      v-if="loading1st"
      height="100"
      class="bg-gray-200 rounded-xl flex-1 mt-[0.75rem] mx-[20px] mb-[32px]"
    ></Skeleton>
    <div
      v-else
      class="pt-[12px] pb-[32px] md:pb-[68px] xl:pb-[32px] px-[20px] flex flex-1 flex-col text-left justify-between md:gap-0 gap-5 md:mb-[10px]"
    >
      <div v-if="!emerPosters?.find((e) => e.status === 'Active')">
        <div
          class="flex flex-row px-4 py-2 lg:px-5 mb-6 gap-7 bg-[#ffe5e5] rounded-lg h-20 items-center"
        >
          <div
            class="w-8 h-8 ml-3 flex items-center justify-center rounded-full"
          >
            <i
              class="pi pi-exclamation-triangle mb-1 text-red-500 text-3xl"
            ></i>
          </div>

          <div class="ml-1 md:text-[16px] text-[13px]">
            <p class="font-bold text-red-500">
              <span>Activating the Emergency Poster</span>
            </p>
            <p>
              there is overriding currently running poster.
              <span class="font-semibold">Please be certain. </span>
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-5 -mt-2">
          <div>
            <p class="md:text-[16px] text-[14px] font-semibold mb-2">
              Choose Poster to displayed
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-40 md:h-28 xl:h-40 overflow-y-scroll"
            >
              <div class="grid grid-cols-2 gap-y-10 md:p-8 p-5 pt-9">
                <div
                  v-for="category in emerPosters?.filter(
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

          <div class="-mt-2">
            <p class="md:text-[16px] text-[14px] font-semibold mb-2">
              Type text to display banner
            </p>
            <div
              class="border-[1px] border-[#CDC8C8]-200 bg-white shadow-sm rounded-xl h-52 md:h-44 xl:h-52"
            >
              <div class="flex flex-col gap-3 md:mx-8 my-5 mx-5">
                <div class="flex gap-2 items-center md:-mt-2">
                  <RadioButton
                    :value="
                      emerPosters?.find((e) => e.incidentName === 'banner')
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
                    class="md:text-[16px] text-[14px] font-notoThai border-[2px] border-[#DBDBDB] p-3 rounded-lg h-[110px] md:h-[85px] xl:h-[110px] bg-none resize-none disabled:text-[#8E8A8A]"
                    :class="{
                      'border-red-500':
                        selectEmer.incidentName === 'banner' &&
                        (selectEmer.emergencyImage.length >= 312 ||
                          checkTextRow),
                    }"
                  ></Textarea>
                  <div
                    v-if="
                      selectEmer.incidentName === 'banner' &&
                      (selectEmer.emergencyImage.length >= 312 || checkTextRow)
                    "
                    class="text-red-500 -mt-2"
                  >
                    {{
                      selectEmer.emergencyImage.length >= 312
                        ? "You have reached the character limit."
                        : "You have reached the row limit."
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col justify-center items-center md:h-[500px] xl:h-[1200px] xl:gap-10"
      >
        <div
          class="flex flex-col justify-center items-center text-2xl bg-[#e9f8f2] border-[1px] border-[#b9ffe3] shadow-md rounded-xl w-80 h-96 gap-10 p-4"
        >
          <img
            class="w-[150px] h-[150px]"
            src="../assets/images/emerActive.png"
          />
          <div class="flex flex-col gap-5">
            <div
              class="text-bold font-notoThai text-4xl text-center font-medium text-[#23C6A0] rounded-full"
            >
              {{
                selectEmer.incidentName.charAt(0).toUpperCase() +
                selectEmer.incidentName.slice(1)
              }}
            </div>
            <div class="flex text-[#3fbda0] text-bold">has been activated</div>
          </div>
        </div>
      </div>

      <div v-if="selectEmer">
        <p
          class="md:text-[17px] text-[14px] font-semibold mb-2 md:-mt-6 xl:mb-2"
          :class="{ 'md:-mt-[100px]  xl:mb-2': selectEmer.status === 'Active' }"
        >
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
              'bg-red-500 hover:bg-red-600': selectEmer.status !== 'Active',
              'bg-[#3fbda0] hover:bg-[#36a78d]': selectEmer.status === 'Active',
            }"
            :disabled="
              !password.length ||
              !selectEmer.emergencyImage ||
              (selectEmer.incidentName === 'banner' &&
                selectEmer.status === 'Deactive' &&
                !selectEmer.emergencyImage.length)
            "
            :loading="loading"
            :label="selectEmer.status === 'Active' ? 'Deactivate' : 'Activate'"
            @click="handleEmergency()"
          ></Button>
        </div>
      </div>
    </div>

    <div
      class="flex-1 border-l-[2px]; border-[#eaeaea] pt-[12px] md:pb-[68px] xl:pb-[40px] px-[20px] flex flex-col"
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
            :src="selectEmer.emergencyImage.dataURL"
            alt="poster-image"
          />
          <div v-else>
            <TextPoster :text="selectEmer.emergencyImage" />
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col items-center justify-center -mt-10">
            <img
              class="w-[0p48x] h-[540px] opacity-20 -ml-[60px]"
              src="../assets/images/TVDS.jpg"
            />
            <div
              class="font-semibold text-xl text-center opacity-20 rounded-full"
            >
              <p class="text-[#3a3737] opacity-100">Preview Poster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rectangleOut {
  overscroll-behavior-y: contain;
  overflow: hidden;
  width: 100%;
  height: 100%;
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

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadImage",
});
</script>

<script setup lang="ts">
import {
  computed,
  watch,
  ref,
  toRefs,
  defineProps,
  onMounted,
  onUpdated,
} from "vue";
import { onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const props = defineProps<{ posType: string; maxImage: number | undefined }>();
const { posType, maxImage } = toRefs(props);
const formPoster = computed(() => store.state.formPoster);
const formEmer = computed(() => store.state.formEmer);
const img = ref<File[]>([]);
const notChoose = ref(true);
const currentDeg = ref(0);
const toast = useToast();

onMounted(() => {
  if (posType.value === "NP" && formPoster.value.image) {
    formPoster.value.image.forEach(async (e) => {
      img.value.push(new File([e.image], formPoster.value.title));
    });
  } 
});

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

watch(img, () => {
  console.log(img.value);
});
</script>

<template>
  <FileUpload
    class="mt-12"
    accept="image/*"
    :show-upload-button="false"
    :multiple="posType === 'NP'"
    :fileLimit="maxImage"
    :pt="{
      buttonbar: {
        class: `${
          posType === 'EP' ? 'border-[#f00] bg-[#f00] bg-opacity-10' : ''
        }`,
      },
      content: {
        class: `${posType === 'EP' ? 'border-[#f00]' : ''}`,
      },
    }"
    @upload="onUpload($event)"
    @select="
      async (e) => {
        if (posType === 'EP') {
          if (e.files.length > 1) e.files.shift();
          if (e.files[0]) {
            formEmer.emergencyImage = await onUpload(e);
          } else errorSelectFile();
        }
      }
    "
  >
    <template #header="{ files, chooseCallback, clearCallback }">
      <div class="flex w-full gap-3 items-center justify-between">
        <div class="flex gap-3 items-center">
          <Button
            @click="
              () => {
                clearCallback();
                formPoster.image = [];
                formEmer.emergencyImage = null;
                currentDeg = 0;
                chooseCallback();
              }
            "
            icon="pi pi-plus"
            label="Choose File"
            rounded
            outlined
          />
        </div>
        <div v-if="posType === 'EP'" class="flex gap-3 items-center">
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
            :class="`${formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'}`"
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
            :class="`${formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'}`"
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
        v-if="posType === 'EP' && files.length"
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
            :alt="formEmer.incidentName"
            :src="formEmer.emergencyImage"
            class="max-w-full max-h-full m-auto rotate-90"
            :style="{
              maxWidth: `${3840 / 20}px`,
              maxHeight: `${2160 / 20}px`,
            }"
          />
        </div>
      </div>
    </template>
    <template #empty>
      <!-- <div
        v-if="notChoose"
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
            :alt="formEmer.incidentName || formPoster.title"
            :src="formEmer.emergencyImage || formPoster.image[0]?.image"
            class="max-w-full max-h-full m-auto rotate-90"
            :style="{
              maxWidth: `${3840 / 20}px`,
              maxHeight: `${2160 / 20}px`,
            }"
          />
        </div>
      </div> -->
      <!-- <div v-if="notChoose" class="flex justify-between items-center w-full">
        <img
          alt="locationImage"
          :src="formEmer.emergencyImage || formPoster.image[0].image"
          class="w-2/4 h-2/4"
        />
        <Button
          icon="pi pi-times"
          @click="notChoose = false"
          outlined
          rounded
          severity="danger"
        />
      </div> -->
      <div class="flex flex-col text-center items-center">
        <i
          class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
        />
        <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
      </div>
    </template>
  </FileUpload>
</template>

<style></style>

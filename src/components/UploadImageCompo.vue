<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadImage",
});
</script>

<script setup lang="ts">
import { computed, ref, toRefs, onMounted, defineProps } from "vue";
import { onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const props = defineProps<{ posType: string; maxImage: number | undefined }>();
const { posType, maxImage } = toRefs(props);
const formPoster = computed(() => store.state.formPoster);
const formEmer = computed(() => store.state.formEmer);
const toast = useToast();

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

const selectImage = (e: any) => {
  store.state.formPoster.image.forEach((e, index) => {
    e.priority = index + 1;
  });
  e.files.forEach(async (image: any, i: number) => {
    const imageDataUrl = await onUpload(image);
    store.state.formPoster.image.push({
      image: imageDataUrl,
      priority: formPoster.value.image.length + 1,
    });
  });
};
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
    @select="
      async (e) => {
        if (posType === 'EP') {
          if (e.files.length > 1) e.files.shift();
          if (e.files[0]) formEmer.emergencyImage = await onUpload(e.files[0]);
        } else if (e.files[0]) {
          selectImage(e);
        } else errorSelectFile();
      }
    "
  >
    <template #header="{ chooseCallback, clearCallback }">
      <div class="flex w-full gap-3 items-center justify-between">
        <div class="flex gap-3 items-center">
          <Button
            @click="
              chooseCallback();
              clearCallback();
            "
            icon="pi pi-plus"
            label="Choose File"
            rounded
            outlined
          />
        </div>
        <div
          v-if="posType === 'EP' && formEmer.emergencyImage"
          class="flex gap-3 items-center"
        >
          <Button
            @click="
              async () => {
                formEmer.emergencyImage = await rotate(
                  formEmer.emergencyImage,
                  -90
                );
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
                formEmer.emergencyImage = await rotate(
                  formEmer.emergencyImage,
                  90
                );
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
    <template #content="{ files, removeFileCallback }">
      <div
        v-if="posType === 'EP' && files[0] && formEmer.emergencyImage"
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
      <div
        v-else
        v-for="(image, index) in formPoster.image"
        :key="index"
        class="content-image"
        @click="
          () => {
            removeFileCallback(index);
            formPoster.image.splice(index, 1);
          }
        "
      >
        <img
          :alt="formPoster.title"
          :src="image.image"
          width="100%"
          height="100%"
        />
        <div class="text-image bg-[#f85a5a]">Remove</div>
      </div>
    </template>
    <template #empty>
      <div
        v-if="posType === 'EP' && formEmer.emergencyImage"
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
        v-else-if="posType !== 'NP' || !formPoster.image.length"
        class="flex flex-col text-center items-center"
      >
        <i
          class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
        />
        <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
      </div>
    </template>
  </FileUpload>
</template>

<style>
.content-image {
  position: relative;
  width: 20%;
  height: 20%;
  display: inline-flex;
  margin-right: 5px;
  border-width: 1px;
  border-color: black;
}

.text-image {
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  color: #000000;
  opacity: 0;
  visibility: hidden;
  align-items: center;
  justify-content: center;
}

.content-image:hover {
  cursor: pointer;
}

.content-image:hover .text-image {
  visibility: visible;
  opacity: 80%;
}
</style>

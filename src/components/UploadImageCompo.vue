<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadImage",
});
</script>

<script setup lang="ts">
import { computed, ref, toRefs, defineProps, onMounted } from "vue";
import { convertUrlToFile, onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const props = defineProps<{ posType: string; maxImage: number | undefined }>();
const { posType, maxImage } = toRefs(props);
const formPoster = computed(() => store.state.formPoster);
const formEmer = computed(() => store.state.formEmer);
const toast = useToast();
const fileUpload = ref();
const loading = ref(false);

onMounted(async () => {
  if (formPoster.value.image) {
    loading.value = true;
    await Promise.all(
      formPoster.value.image.map(async (p) => {
        if (p.image && typeof p.image === "string")
          p.image = await convertUrlToFile(p.image);
      })
    );
    loading.value = false;
  }
});

const errorSelectFile = async () => {
  if (
    maxImage.value &&
    formPoster.value.image?.length + fileUpload.value.files.length >=
      maxImage.value
  ) {
    toast.add({
      severity: "error",
      summary: "Invalid file limit",
      detail: `File limit : ${maxImage.value}`,
      life: 3000,
    });
  } else {
    const message = fileUpload.value.messages[0]
      .split(": ")
      .slice(1)
      .join(" ")
      .split(", ");
    toast.add({
      severity: "error",
      summary: message[0],
      detail: message[1],
      life: 3000,
    });
  }
};

const selectImage = async (event: any) => {
  loading.value = true;
  if (!store.state.formPoster.image) {
    store.state.formPoster.image = [];
  }
  const initialLength = store.state.formPoster.image.length;
  const filePromises = event.files.map(async (e: any, i: number) => {
    const priority = initialLength + i + 1;
    const file = await onUpload(e);
    file.name = `${formPoster.value.title}-${priority}.${e.name
      .split(".")
      .pop()}`;
    return {
      image: file,
      priority: priority,
    };
  });
  const processedFiles = await Promise.all(filePromises);
  store.state.formPoster.image.push(...processedFiles);
  loading.value = false;
};

const removeImage = (i: number) => {
  store.state.formPoster.image.splice(i, 1);
  store.state.formPoster.image.forEach((e, index) => {
    e.priority = index + 1;
    e.image.name = `${formPoster.value.title}-${index + 1}.${e.image.name
      .split(".")
      .pop()}`;
  });
};
</script>

<template>
  <FileUpload
    ref="fileUpload"
    class="mt-12"
    accept="image/*"
    :show-upload-button="false"
    :multiple="posType === 'NP'"
    :fileLimit="maxImage"
    :maxFileSize="52428800" 
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
        if (posType === 'EP' && e.files[0]) {
          formEmer.emergencyImage = await onUpload(e.files[0]);
        } else if (
          e.files[0] &&
          maxImage &&
          formPoster.image.length + e.files.length <= maxImage
        ) {
          selectImage(e);
        } else errorSelectFile();
        if (e.files.length) e.files.splice(0, e.files.length);
      }
    "
  >
    <template #header="{ chooseCallback }">
      <div class="flex w-full gap-3 items-center justify-between">
        <div class="flex gap-3 items-center">
          <Button
            @click="chooseCallback()"
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
                formEmer.emergencyImage.dataURL = await rotate(
                  formEmer.emergencyImage.dataURL,
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
                formEmer.emergencyImage.dataURL = await rotate(
                  formEmer.emergencyImage.dataURL,
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
    <template #content="{ removeFileCallback }">
      <ProgressSpinner
        v-if="loading"
        strokeWidth="6"
        animationDuration=".5s"
        class="flex flex-col text-center items-center"
      />
      <div
        v-else-if="posType === 'EP' && formEmer.emergencyImage"
        class="flex flex-row justify-center text-center items-center gap-3"
      >
        <i class="pi pi-power-off"></i>
        <div
          class="flex justify-center bg-black"
          :style="{
            width: `${2160 / 20}px`,
            height: `${3840 / 20}px`,
          }"
        >
          <img
            :alt="formEmer.incidentName"
            :src="formEmer.emergencyImage.dataURL"
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
        :key="image.image.name"
        class="content-image"
        @click="
          () => {
            removeFileCallback(index);
            removeImage(index);
          }
        "
      >
        <img
          loading="eager"
          :alt="image.image.name"
          :src="image.image.dataURL"
          width="100%"
          height="100%"
        />
        <div class="text-image bg-[#f85a5a]">Remove</div>
      </div>
    </template>
    <template #empty v-if="!loading">
      <div
        v-if="!formEmer.emergencyImage && !formPoster.image?.length"
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

.p-message.p-message-error {
  display: none;
}
</style>

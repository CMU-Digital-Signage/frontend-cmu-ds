<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadImage",
});
</script>

<script setup lang="ts">
import { computed, ref, toRefs, defineProps, onMounted, onUpdated } from "vue";
import { onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const props = defineProps<{ posType: string }>();
const { posType } = toRefs(props);
const formPoster = computed(() => store.state.formPoster);
const formEmer = computed(() => store.state.formEmer);
const currentDeg = ref(0);
const toast = useToast();

onMounted(() => {
  store.state.formPoster.image = [];
});

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};
</script>

<template>
  <FileUpload
    class="mt-12"
    accept="image/*"
    :show-upload-button="false"
    :multiple="posType === 'NP'"
    @select="
      async (e) => {
        if (e.files[0] && posType === 'NP') {
          const img = await onUpload(e);
          store.state.formPoster.image.push({ image: img, priority: 1 });
        } else if (e.files[0] && posType === 'EP') {
          formEmer.emergencyImage = await onUpload(e);
        } else errorSelectFile();
      }
    "
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
  >
    <template #header="{ files, chooseCallback, clearCallback }">
      <div class="flex w-full gap-3 items-center justify-between">
        <div class="flex gap-3 items-center">
          <Button
            @click="
              clearCallback();
              formPoster.image = [];
              formEmer.emergencyImage = null;
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
        v-if="files[0] && (formPoster.image || formEmer.emergencyImage)"
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
            :src="formPoster.image[0]?.image || formEmer.emergencyImage"
            class="max-w-full max-h-full m-auto rotate-90"
            :style="{
              maxWidth: `${3840 / 20}px`,
              maxHeight: `${2160 / 20}px`,
            }"
          />
        </div>
      </div>
      <div v-else class="flex flex-col justify-center items-center h-48 gap-3">
        <i
          class="pi pi-cloud-upload border-2 rounded-full text-4xl w-fit p-4 mt-1"
        ></i>
        <p class="mt-3 mb-0">Drag and drop files to here.</p>
      </div>
    </template>
  </FileUpload>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadEmergency",
});
</script>
<script setup lang="ts">
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import { onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const formEmer = computed(() => store.state.formEmer);
const currentDeg = ref(0);

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
  <Toast />
  <div class="flex flex-row justify-between gap-3 mx-1">
    <div class="flex flex-col justify-start w-full max-w-4xl gap-5">
      <InputText
        v-model="formEmer.incidentName"
        type="text"
        placeholder="Title"
        class="title-input"
      />

      <!-- File Upload -->
      <FileUpload
        accept="image/*"
        :show-upload-button="false"
        :multiple="false"
        @select="
          async (e) => {
            if (e.files[0]) formEmer.emergencyImage = await onUpload(e);
            else errorSelectFile();
          }
        "
        :pt="{
          buttonbar: {
            class: 'border-[#f00] bg-[#f00] bg-opacity-10',
          },
          content: {
            class: 'border-[#f00]',
          },
        }"
      >
        <template #header="{ files, chooseCallback, clearCallback }">
          <div class="flex w-full gap-3 items-center justify-between">
            <div class="flex gap-3 items-center">
              <Button
                @click="
                  clearCallback();
                  formEmer.emergencyImage = null;
                  currentDeg = 0;
                  chooseCallback();
                "
                icon="pi pi-plus"
                label="Choose File"
                rounded
                outlined
              />
              <Button
                @click="
                  () => {
                    clearCallback();
                    formEmer.emergencyImage = null;
                    currentDeg = 0;
                  }
                "
                :class="`${formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-times"
                label="Cancel"
                rounded
                outlined
                severity="danger"
                :disabled="!formEmer.emergencyImage"
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
            v-if="files[0] && formEmer.emergencyImage"
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
            class="flex flex-col justify-center items-center h-48 gap-3"
          >
            <i
              class="pi pi-cloud-upload border-2 rounded-full text-4xl w-fit p-4 mt-1"
            ></i>
            <p class="mt-3 mb-0">Drag and drop files to here.</p>
            <!-- <p class="text-[#176EE2] red">Support JPEG only.</p> -->
          </div>
        </template>
      </FileUpload>

      <!-- Description -->
      <div class="flex flex-col gap-2 w-full h-full">
        <label
          for="Description"
          class="text-[#282828] font-semibold text-[18px] flex justify-start"
          >Description</label
        >
        <InputText
          v-model="formEmer.description"
          type="text"
          class="description-input h-full"
        ></InputText>
      </div>
    </div>
  </div>
</template>

<style scope>
.title-input {
  box-shadow: none;
  border: none;
  border-radius: 0%;
  border-bottom: 2px solid #aaa;
  padding: 1px;
  color: #000000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
  margin-top: 16px;
}

.description-input {
  box-shadow: none;
  border-radius: 10px;
  border: 1px solid #4a484c;
}
</style>

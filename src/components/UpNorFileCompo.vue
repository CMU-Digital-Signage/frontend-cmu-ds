<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadNormal",
});
</script>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ScheduleForm from "./ScheduleForm.vue";
import InputText from "primevue/inputtext";
import { Poster } from "@/types";
import { filesize } from "filesize";
import { onUpload } from "@/utils/constant";

const scheduleTabs = reactive([{ header: "Schedule 1" }]);

const form = reactive({
  title: "",
  id: 0,
  duration: 0,
  recurrence: "",
  description: "",
  image: "" as any,
  createdAt: new Date(),
  updatedAt: new Date(),
  MACaddress: "",
} as Poster);

const chooseFile = ref();

const add_file = async () => {
  form.title = (document.getElementById("Title") as HTMLInputElement).value;
  form.description = (
    document.getElementById("Description") as HTMLInputElement
  ).value;
  if (!form.image && !form.title) {
    alert("Poster File or Poster Name Invalid");
    return;
  }
};

const addSchedule = () => {
  const newSchedule = {
    header: `${scheduleTabs.length + 1}`,
  };
  scheduleTabs.push(newSchedule);
};
</script>

<template>
  <div class="flex flex-row justify-between gap-3 mx-1 font-sf-pro">
    <div class="flex flex-col justify-start w-full max-w-4xl gap-5">
      <InputText
        id="Title"
        type="text"
        placeholder="Title"
        class="title-input"
      />

      <!-- File Upload -->
      <FileUpload
        accept="image/jpeg"
        :show-upload-button="false"
        :multiple="false"
        @select="
          async (e) => {
            chooseFile = await onUpload(e);
          }
        "
      >
        <template #header="{ chooseCallback, clearCallback }">
          <div class="flex w-full gap-3 items-center justify-between">
            <div class="flex gap-3 items-center">
              <Button
                @click="
                  clearCallback();
                  chooseFile = null;
                  chooseCallback();
                  console.log(chooseFile);
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
                    chooseFile = null;
                  }
                "
                :class="`${chooseFile ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-times"
                label="Cancle"
                rounded
                outlined
                severity="danger"
                :disabled="!chooseFile"
              />
            </div>
            <div class="flex gap-3 items-center">
              <Button
                :class="`${chooseFile ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-replay"
                rounded
                outlined
                :disabled="!chooseFile"
              />
              <Button
                :class="`${chooseFile ? '' : 'text-[#9c9b9b]'}`"
                icon="pi pi-refresh"
                rounded
                outlined
                :disabled="!chooseFile"
              />
            </div>
          </div>
        </template>
        <template #content="{ files }">
          <div
            v-if="files[0] && chooseFile"
            class="border-2 border-black w-[2160px - 2000px] h-[3840px - 2000px]"
          >
            <!-- <div class="w-fit">{{ filesize(files[0].size) }}</div> -->
            <img :alt="files[0].name" :src="chooseFile" class="w-1/4 h-1/4" />
          </div>
          <div v-else></div>
        </template>
        <template #empty>
          <div class="flex flex-col text-center items-center h-48">
            <i
              class="pi pi-cloud-upload border-2 rounded-full text-5xl w-fit p-5"
            ></i>
            <p class="mt-4 mb-0">Drag and drop files to here.</p>
            <p class="text-[#176EE2] red">Support JPEG only.</p>
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
          id="Description"
          type="text"
          class="description-input h-full"
        ></InputText>
      </div>
    </div>

    <div class="w-full max-w-4xl">
      <div class="rectangle8 font-sf-pro flex items-start gap-3">
        <TabView
          class="rectangleflex flex-row flex-1 justify-between w-52 font-sf-pro scroll-x"
        >
          <TabPanel
            v-for="(schedule, index) in scheduleTabs"
            :key="index"
            :header="schedule.header"
          >
            <ScheduleForm />
          </TabPanel>
        </TabView>

        <Button
          @click="addSchedule"
          class="flex items-center justify-center mt-3 rounded-md w-8 h-8"
          ><i class="pi pi-plus text-white"></i
        ></Button>
      </div>
    </div>
  </div>
</template>

<style>
.screen {
  width: 2160px ;
  height: 3840px ;
}

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

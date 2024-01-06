<script setup lang="ts">
import { reactive, ref } from "vue";
import SetFile from "@/components/ScheduleForm.vue";
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
  <div class="rectangle9 font-sf-pro">
    <div class="flex flex-col justify-start w-full h-full gap-5">
      <InputText
        id="Title"
        type="text"
        placeholder="Title"
        class="title-input"
      />

      <div class="flex flex-ro">
        <label
          for="Description"
          class="text-[#282828] font-semibold text-[18px] flex justify-start"
          >Upload File</label
        >
        <label for="deviceName" class="text-[#FF0000] font-medium">*</label>
      </div>
      <FileUpload
        accept="image/jpeg"
        customUpload
        :show-upload-button="false"
        :show-cancel-button="false"
        :multiple="false"
        @select="
          async (e) => {
            chooseFile = await onUpload(e);
            console.log(chooseFile, e.files[0]);
          }
        "
      >
        <template #header="{ chooseCallback, clearCallback }">
          <div class="flex items-center">
            <Button
              @click="
                clearCallback();
                chooseFile = null;
                chooseCallback();
              "
              icon="pi pi-plus"
              label="Choose File"
              rounded
              outlined
            ></Button>
          </div>
        </template>
        <template #content="{ files, removeFileCallback }">
          <div
            v-if="files[0] && chooseFile"
            class="flex justify-between items-center w-full"
          >
            <img :alt="files[0].name" :src="chooseFile" class="w-2/4 h-2/4" />
            <div class="w-fit">{{ filesize(files[0].size) }}</div>
            <Button
              icon="pi pi-times"
              @click="removeFileCallback(0)"
              outlined
              rounded
              severity="danger"
            />
          </div>
          <div v-else></div>
        </template>
        <template #empty>
          <div class="flex flex-col text-center items-center">
            <i
              class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
            />
            <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
          </div>
        </template>
      </FileUpload>
      <div class="flex flex-col gap-2">
        <label
          for="Description"
          class="text-[#282828] font-semibold text-[18px] flex justify-start"
          >Description</label
        >
        <InputText
          id="Description"
          type="text"
          class="description-input"
        ></InputText>
      </div>

      <Button
        class="bg-[#176EE2] text-white w-20 h-10 rounded-lg flex items-center justify-center"
        >Save</Button
      >
    </div>

    <div class="w-full">
      <div class="rectangle8 font-sf-pro flex items-start gap-3">
        <TabView
          class="rectangleflex flex-row flex-1 justify-between max-w-[445px] scroll-x"
        >
          <TabPanel
            v-for="(schedule, index) in scheduleTabs"
            :key="index"
            :header="schedule.header"
          >
            <SetFile />
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
  width: 542px;
  height: 129px;
}

.rectangle9 {
  background-color: #b2c19600;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 -1rem;
}
</style>

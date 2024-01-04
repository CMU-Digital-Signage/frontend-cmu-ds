<script lang="ts">
import { defineComponent, reactive } from "vue";
import SetFile from "@/components/DateFileSetCompo.vue";
import InputText from "primevue/inputtext";
import { Poster } from "@/types";

const form = reactive({
  data: {
    title: "",
    id: 0,
    duration: 0,
    recurrence: "",
    description: "",
    image: "" as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    MACaddress: "",
  } as Poster,
});

const add_file = async () => {
  form.data.title = (
    document.getElementById("Title") as HTMLInputElement
  ).value;
  form.data.description = (
    document.getElementById("Description") as HTMLInputElement
  ).value;
  if (!form.data.image && !form.data.title) {
    alert("Poster File or Poster Name Invalid");
    return;
  }
};

export default defineComponent({
  name: "UploadCompo",
  components: { SetFile },
  data() {
    return {
      scheduleTabs: [{ header: "Schedule 1" }],
    };
  },
  methods: {
    addSchedule() {
      const newSchedule = {
        header: `${this.scheduleTabs.length + 1}`,
      };
      this.scheduleTabs.push(newSchedule);
    },
  },
});
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
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        :multiple="true"
        :maxFileSize="1000000"
      >
        <template #header="{ chooseCallback, clearCallback, files }">
          <div
            class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2"
          >
            <div class="flex gap-2">
              <Button
                icon="pi pi-images"
                @click="chooseCallback()"
                rounded
                outlined
              ></Button>
              <Button
                icon="pi pi-times"
                @click="clearCallback()"
                rounded
                outlined
                severity="danger"
                :disabled="!files || files.length === 0"
              ></Button>
            </div>
            <ProgressBar
              :showValue="false"
              :class="['md:w-20rem h-1rem w-full md:ml-auto']"
              ><span class="white-space-nowrap"></span
            ></ProgressBar>
          </div>
        </template>
        <template #content="{ files, uploadedFiles }">
          <div v-if="files.length > 0">
            <h5>Pending</h5>
            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
              <div
                v-for="file of files"
                :key="file.name + file.type + file.size"
                class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
              >
                <div>
                  <img
                    role="presentation"
                    width="100"
                    height="50"
                    class="shadow-2"
                  />
                </div>
                <span class="font-semibold">{{ file.name }}</span>

                <Badge value="Pending" severity="warning" />
                <Button icon="pi pi-times" outlined rounded severity="danger" />
              </div>
            </div>
          </div>

          <div v-if="uploadedFiles.length > 0">
            <h5>Completed</h5>
            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
              <div
                v-for="file of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
              >
                <div>
                  <img
                    role="presentation"
                    width="100"
                    height="50"
                    class="shadow-2"
                  />
                </div>
                <span class="font-semibold">{{ file.name }}</span>

                <Badge value="Completed" class="mt-3" severity="success" />
                <Button icon="pi pi-times" outlined rounded severity="danger" />
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div
            class="flex align-items-center justify-content-center flex-column"
          >
            <i
              class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
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
            <p>{{ index + 1 }}</p>
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

<script lang="ts">
import { defineComponent, reactive } from "vue";
import InputText from "primevue/inputtext";
import { TabView, TabPanel } from "primevue/tabview";
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
} as { data: Poster });

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
  components: {
    TabView,
    TabPanel,
  },
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
        placeholder="Add Title"
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
      <FileUpload mode="basic" name="demo[]" accept="image/*" customUpload />

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
      <div class="rectangle8 flex-1 font-sf-pro">
        <TabView class="rectangle flex flex-col">
          <TabPanel
            v-for="(schedule, index) in scheduleTabs"
            :key="index"
            :header="schedule.header"
          >
            <p>Schedule {{ index + 1 }}</p>
          </TabPanel>
        </TabView>

        <button @click="addSchedule">
          <i class="pi pi-plus text-black"></i>
        </button>
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
  /* border: none; */
  color: #aaa;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
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

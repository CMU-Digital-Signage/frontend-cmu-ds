<template>
  <div class="flex flex-row gap-10 -mx-4 font-sf-pro">
    <div class="flex flex-col justify-start w-full h-full gap-5">
      <InputText
        v-model="titleValue"
        type="text"
        placeholder="Add Title"
        class="title-input"
      />
      <p class="text-[#282828] font-semibold text-[18px] flex justify-start">
        Upload File
      </p>

      <!-- <FileUpload
        name="demo[]"
        url="/api/upload"
        @upload="onTemplatedUpload($event)"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
        @select="onSelectedFiles"
        class="custom-file-upload-style"
      >
        
      </FileUpload>    -->
      <p class="text-[#282828] font-semibold text-[18px] flex justify-start">
        Description
      </p>
      <InputText
        v-model="descriptionValue"
        type="text"
        placeholder="Add Title"
        class="description-input"
      />

    </div>
    <div class="bg-red w-full h-full">md</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InputText from "primevue/inputtext";

export default defineComponent({
  name: "UploadCompo",
  data() {
    return {
      titleValue: "",
      descriptionValue: "",
    };
  },
  //   methods: {
  //   onSelectedFiles(event) {
  //     console.log('Selected Files:', event);
  //     // Your code here
  //   },
  //   onTemplatedUpload(event) {
  //     console.log('Upload Event:', event);
  //     // Your code here
  //   }
});
</script>

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
</style>

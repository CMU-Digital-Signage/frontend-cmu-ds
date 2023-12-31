<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DeviceCompo",
});
</script>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import store from "@/store";
import { editDevice, deleteDevice } from "@/services";
import { filesize } from "filesize";
import { initialFormDevice, onUpload } from "@/utils/constant";
const form = reactive({ ...initialFormDevice });

const device = computed(() => store.state.devices);
const chooseFile = ref();
const oldFile = ref<File>();
const notChoose = ref(true);
const showPopup = ref(false);
const message = ref();

const setForm = (i: number) => {
  Object.assign(form, device.value[i]);
  oldFile.value = new File([form.location], "locationImage");
};

const resetForm = () => {
  Object.assign(form, initialFormDevice);
  notChoose.value = true;
};

const toggleOverlay = (e: any, panel: any) => {
  panel.toggle(e);
};

const edit = async () => {
  const check = form.deviceName?.replace(" ", "").length;
  if (!check) {
    alert("Device Name Invalid");
    return;
  }
  if (chooseFile.value) {
    form.location = chooseFile.value;
  }

  const res = await editDevice(form);
  device.value?.map((e) =>
    e.MACaddress === form.MACaddress ? { ...e, ...form } : e
  );
  message.value = res.message;
  showPopup.value = false;
  console.log(message.value);
};

const del = async (MACaddress: any) => {
  const res = await deleteDevice(MACaddress);
  const temp = device.value?.filter((e) => e.MACaddress !== MACaddress);
  store.commit("setDevices", temp);
  message.value = res.message;
};

const calculateScreenHeight = () => {
  const screenHeight = window.innerHeight;
  const multiplier = 0.71;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
}

</script>

<template>
  <div class="rectangle5">
    <p v-if="!device">Loading...</p>
    <DataTable
      v-else
      scrollDirection="vertical"
      scrollable
      :scrollHeight=calculateScreenHeight()
      class="font-sf-pro mt-2"
      :value="device"
    >
      <Column
        field="deviceName"
        header="Device Name"
        sortable
        class="font-semibold"
        headerStyle="font-bold"
      >
        <template #body="rowData">
          <div class="flex items-center gap-3">
            <p>{{ rowData.data.deviceName }}</p>
            <i
              class="pi pi-info-circle cursor-pointer"
              @click="
                (e) =>
                  toggleOverlay(e, $refs[`overlay_${rowData.data.MACaddress}`])
              "
            />
            <OverlayPanel
              :ref="`overlay_${rowData.data.MACaddress}`"
              class="w-fit h-fit max-w-md max-h-max"
            >
              <img
                v-if="rowData.data.location"
                :src="rowData.data.location"
                alt="location"
                class="object-cover"
              />
              <p>{{ rowData.data.description }}</p>
            </OverlayPanel>
          </div>
        </template>
      </Column>
      <Column
        field="room"
        header="Room"
        sortable
        class="font-semibold"
        headerStyle="font-bold"
      ></Column>
      <Column :exportable="false">
        <template #body="rowData">
          <div class="">
            <Button
              icon="pi pi-pencil"
              rounded
              class="w-9 h-9"
              severity="warning"
              @click="
                showPopup = true;
                setForm(rowData.index);
              "
            />
            <Button
              icon="pi pi-trash"
              rounded
              class="w-9 h-9 mx-3"
              severity="danger"
              @click="del(rowData.data.MACaddress)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog
    v-model:visible="showPopup"
    header="Edit Device"
    class="w-[600px] h-auto"
    modal
    close-on-escape
    @after-hide="resetForm()"
  >
    <div class="flex flex-col gap-2">
      <div class="inline-block">
        <label for="deviceName" class="text-primary-50 font-medium"
          >Device Name</label
        >
        <label for="deviceName" class="text-[#FF0000] font-medium">*</label>
      </div>
      <InputText
        v-model="form.deviceName"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="cpe01"
      ></InputText>
    </div>
    <div class="flex flex-col gap-2">
      <div class="inline-block">
        <label for="deviceName" class="text-primary-50 font-medium"
          >MAC Address</label
        >
        <label for="deviceName" class="text-[#FF0000] font-medium">*</label>
      </div>
      <InputText
        v-model="form.MACaddress"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3 cursor-not-allowed"
        disabled
      ></InputText>
    </div>
    <div class="flex flex-col gap-2">
      <label for="macAddress" class="text-primary-50 font-medium">Room</label>
      <InputText
        v-model="form.room"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="(Optional)"
      ></InputText>
    </div>
    <div class="flex flex-col gap-1">
      <label for="macAddress" class="text-primary-50 font-medium"
        >Location Description</label
      >
      <InputText
        v-model="form.description"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="(Optional)"
      ></InputText>
    </div>
    <div class="flex flex-col gap-1">
      <label for="macAddress" class="text-primary-50 font-medium"
        >Location Photo (JPEG)</label
      >
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
            <img alt="locationImage" :src="chooseFile" class="w-2/4 h-2/4" />
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
          <div
            v-if="notChoose"
            class="flex justify-between items-center w-full"
          >
            <img alt="locationImage" :src="form.location" class="w-2/4 h-2/4" />
            <Button
              icon="pi pi-times"
              @click="notChoose = false"
              outlined
              rounded
              severity="danger"
            />
          </div>
          <div v-else class="flex flex-col text-center items-center">
            <i
              class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
            />
            <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
          </div>
        </template>
      </FileUpload>
    </div>
    <div class="flex flex-row gap-4 pt-3">
      <Button
        label="Cancel"
        text
        @click="showPopup = false"
        class="flex-1 border-1 border-white-alpha-30 bold-ho rounded-lg py-2 bold-ho mt-2"
      ></Button>
      <Button
        label="Done"
        text
        class="flex-1 border-1 font-semibold border-white-alpha-30 bold-ho-add rounded-lg py-2 bold-ho-add mt-2"
        @click="edit"
      ></Button>
    </div>
  </Dialog>
</template>

<style>
.rectangle5 {
  background-color: #b2c19600; /* Adjust the background color as needed */
  padding-bottom: 2rem;
}

.bold-ho:hover {
  font-weight: 600;
  background-color: #e2e2e2;
}

.bold-ho-add:hover {
  font-weight: 600;
  text-decoration: underline;
  background-color: #a9ddf8;
}
</style>

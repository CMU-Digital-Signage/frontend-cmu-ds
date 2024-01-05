<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import store from "@/store";
import router from "@/router";
import { getDevice } from "@/services";
import { Device } from "@/types";
import { editDevice, deleteDevice } from "@/services/device";
import OverlayPanel from "primevue/overlaypanel";
import Compressor from "compressorjs";

const form = reactive({
  data: {
    MACaddress: "",
    deviceName: "",
    room: "",
    location: "" as any,
    description: "",
  } as Device,
});

const device = computed(() => store.state.devices);
const showPopup = ref(false);
const message = ref();

const toggleOverlay = (e: any, panel: any) => {
  panel.toggle(e);
};

const onUpload = (e: any) => {
  const file = e.files[0];
  if (!file) return;

  new Compressor(file, {
    quality: 0.6,
    async success(result) {
      console.log(result);
      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onloadend = function () {
        form.data.location = reader.result;
      };
    },
  });
};

const edit = async () => {
  form.data.MACaddress = (
    document.getElementById("MACaddress") as HTMLInputElement
  ).value;
  form.data.deviceName = (
    document.getElementById("deviceName") as HTMLInputElement
  ).value;
  form.data.room = (document.getElementById("room") as HTMLInputElement).value;
  if (!form.data.MACaddress && !form.data.deviceName) {
    alert("MAC Address or Device Name Invalid");
    return;
  }
  form.data.description = (
    document.getElementById("locationDescription") as HTMLInputElement
  ).value;

  const res = await editDevice(form.data);
  device.value?.map((e) =>
    e.MACaddress === form.data.MACaddress ? { ...e, ...form.data } : e
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
</script>

<template>
  <div class="rectangle5">
    <p v-if="!device">Loading...</p>
    <DataTable
      v-else
      scrollDirection="vertical"
      scrollable
      scrollHeight="calc(100vh - 200px)"
      class="font-sf-pro"
      :value="device"
    >
      <Column
        field="deviceName"
        header="Device Name"
        sortable
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
                form.data = rowData.data;
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
    class="w-auto h-auto"
    modal
    close-on-escape
  >
    <div class="flex flex-col gap-2">
      <div class="inline-block">
        <label for="deviceName" class="text-primary-50 font-medium"
          >Device Name</label
        >
        <label for="deviceName" class="text-[#FF0000] font-medium">*</label>
      </div>
      <InputText
        id="deviceName"
        :value="form.data.deviceName"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg mb-3"
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
        id="MACaddress"
        :value="form.data.MACaddress"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg mb-3 cursor-not-allowed"
        disabled
      ></InputText>
    </div>
    <div class="flex flex-col gap-2">
      <label for="macAddress" class="text-primary-50 font-medium">Room</label>
      <InputText
        id="room"
        :value="form.data.room"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg mb-3"
        placeholder="(Optional)"
        a
      ></InputText>
    </div>
    <div class="flex flex-col gap-1">
      <label for="macAddress" class="text-primary-50 font-medium"
        >Location Description</label
      >
      <InputText
        id="locationDescription"
        :value="form.data.description"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-96 rounded-lg mb-3"
        placeholder="(Optional)"
      ></InputText>
    </div>
    <div class="flex flex-col gap-1">
      <label for="macAddress" class="text-primary-50 font-medium"
        >Location Photo</label
      >
      <FileUpload
        mode="basic"
        name="demo[]"
        accept="image/*"
        customUpload
        @select="onUpload"
      />
    </div>
    <div class="flex flex-row gap-4 pt-3">
      <Button
        label="Cancel"
        text
        @click="showPopup = false"
        class="flex-1 border-1 border-white-alpha-30 bold-ho rounded-lg py-2"
      ></Button>
      <Button
        label="Done"
        text
        class="flex-1 border-1 border-white-alpha-30 bold-ho-add rounded-lg py-2"
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DeviceCompo",
});
</script>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import store from "@/store";
import {
  editDevice,
  deleteDevice,
  turnOffDevice,
  turnOnDevice,
} from "@/services";
import { Device } from "@/types";
import {
  initialFormDevice,
  onUpload,
  calculateScreenHeight,
} from "@/utils/constant";
import { useToast } from "primevue/usetoast";

const form = reactive({ ...initialFormDevice });
const device = computed(() => store.state.devices);
const showPopup = ref(false);
const toast = useToast();
const loading = ref(false);

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};

const toggleOverlay = (e: any, panel: any) => {
  panel.toggle(e);
};

const edit = async () => {
  loading.value = true;
  const check =
    !form.deviceName?.replace(" ", "").length ||
    !form.room?.replace(" ", "").length;
  if (check) {
    toast.add({
      severity: "error",
      summary: "Invalid Input",
      detail: "Device Name or Room Invalid",
      life: 3000,
    });
    return;
  }

  const res = await editDevice(form);
  if (res.ok) {
    showPopup.value = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: res.message,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
  loading.value = false;
};

const del = async (MACaddress: any) => {
  const res = await deleteDevice(MACaddress);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: res.message,
    life: 3000,
  });
};

const changeStatusDevice = async (data: Device) => {
  if (data.status) {
    const res = await turnOffDevice(data.MACaddress!);
  } else {
    const res = await turnOnDevice(data.MACaddress!);
  }
};
</script>

<template>
  <Toast />
  <div class="rectangle2">
    <DataTable
      :value="device"
      scrollDirection="vertical"
      scrollable
      :scrollHeight="calculateScreenHeight()"
      class="mt-2"
    >
      <Column
        field="deviceName"
        header="Device Name"
        sortable
        class="font-semibold"
      >
        <template #sorticon="slotProps">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': slotProps.sortOrder === 0,
              'pi-sort-alpha-down': slotProps.sortOrder === 1,
              'pi-sort-alpha-up': slotProps.sortOrder === -1,
            }"
          ></i>
        </template>
        <template #body="rowData">
          <div class="flex items-center gap-3">
            <p class="font-light">{{ rowData.data.deviceName }}</p>
            <i
              class="pi pi-info-circle cursor-pointer"
              @mouseover="
                (e) =>
                  toggleOverlay(e, $refs[`overlay_${rowData.data.MACaddress}`])
              "
              @mouseleave="
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
      >
        <template #sorticon="slotProps">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': slotProps.sortOrder === 0,
              'pi-sort-numeric-down': slotProps.sortOrder === 1,
              'pi-sort-numeric-up': slotProps.sortOrder === -1,
            }"
          ></i>
        </template>
        <template #body="rowData">
          <div class="flex items-center gap-3">
            <p class="font-light">
              {{ rowData.data.room }}
            </p>
          </div>
        </template>
      </Column>
      <Column header="Action" :exportable="false">
        <template #body="rowData">
          <div class="inline-flex gap-3">
            <Button
              icon="pi pi-pencil"
              rounded
              class="w-9 h-9"
              severity="warning"
              @click="
                showPopup = true;
                Object.assign(form, rowData.data);
              "
            />
            <Button
              icon="pi pi-trash"
              rounded
              class="w-9 h-9"
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
    :closable="!loading"
    close-on-escape
    @after-hide="Object.assign(form, initialFormDevice)"
    :pt="{
      content: {
        style:
          'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7);',
      },
      header: {
        style:
          'border-top-left-radius: 20px; border-top-right-radius: 20px; background-image: linear-gradient(to right, #f4feff, #F6FDF7); ',
      },
      mask: {
        style: 'backdrop-filter: blur(2px)',
      },
    }"
  >
    <div class="flex flex-col gap-2">
      <div class="inline-block">
        <label for="deviceName" class="text-primary-50 font-medium">
          Device Name
        </label>
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
        <label for="deviceName" class="text-primary-50 font-medium">
          MAC Address
        </label>
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
      <label for="macAddress" class="text-primary-50 font-medium">
        Location Description
      </label>
      <InputText
        v-model="form.description"
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="(Optional)"
      ></InputText>
    </div>
    <div class="flex flex-col gap-1">
      <label for="macAddress" class="text-primary-50 font-medium">
        Location Photo
      </label>
      <FileUpload
        accept="image/*"
        :show-upload-button="false"
        :show-cancel-button="false"
        :multiple="false"
        @select="
          async (e) => {
            if (e.files[0]) form.location = await onUpload(e.files[0]);
            else errorSelectFile();
            e.files.shift();
          }
        "
      >
        <template #header="{ chooseCallback, clearCallback }">
          <div class="flex items-center">
            <Button
              @click="
                clearCallback();
                chooseCallback();
              "
              icon="pi pi-plus"
              label="Choose File"
              rounded
              outlined
            ></Button>
          </div>
        </template>
        <template #content>
          <div
            v-if="form.location"
            class="flex justify-between items-center w-full"
          >
            <img alt="locationImage" :src="form.location" class="w-2/4 h-2/4" />
            <Button
              icon="pi pi-times"
              @click="form.location = ''"
              outlined
              rounded
              severity="danger"
            />
          </div>
          <div v-else></div>
        </template>
        <template #empty>
          <div
            v-if="!form.location"
            class="flex flex-col text-center items-center"
          >
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
        :loading="loading"
        @click="showPopup = false"
        class="secondaryButton"
      ></Button>
      <Button
        label="Done"
        :loading="loading"
        class="primaryButton"
        @click="edit"
      ></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.rectangle2 {
  flex: 1 1;
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

.secondaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: none;
  color: black;
  cursor: pointer;
  margin-right: 10px;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}

.primaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  background-color: none;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: rgb(37, 135, 240);
  text-decoration-line: underline;
}
</style>

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
const deletePopup = ref(false);
const selectDelDevice = ref<Device>();
const limitCharRoom = ref(false);
const limitCharDevice = ref(false);
const isNumber = ref(true);

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
  if (form.location)
    form.location.name = `${form.MACaddress}.${form.location.name
      .split(".")
      .pop()}`;

  const res = await editDevice(form);
  loading.value = true;
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

const del = async () => {
  loading.value = true;
  const res = await deleteDevice(selectDelDevice.value?.MACaddress || "");
  toast.add({
    severity: "success",
    summary: "Success",
    detail: res.message,
    life: 3000,
  });
  loading.value = false;
  deletePopup.value = false;
  selectDelDevice.value = undefined;
};

const checkValidRoomNumber = () => {
  const value = form.room;
  if (!Number.isInteger(Number(value))) {
    form.room = "";
    return false;
  }
};
</script>

<template>
  <Toast />
  <Dialog
    :closable="!loading"
    v-model:visible="deletePopup"
    modal
    close-on-escape
    :draggable="false"
    class="w-[425px]"
    :pt="{
      content: {
        style:
          'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
      },
      header: {
        style: 'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
      },
      mask: {
        style:
          'backdrop-filter:  brightness(50%) grayscale(100%) contrast(150%) blur(3px)',
      },
    }"
  >
    <template #header>
      <div class="header-popup">
        Delete "{{ selectDelDevice?.deviceName }}" device?
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div>
        Deleting this device will also remove all posters associated with it,
        but this device's MAC address can be re-added if Raspberry Pi restart
        again.
      </div>
      <div class="inline-block">
        <div class="flex flex-row gap-4 pt-3">
          <Button
            text
            :loading="loading"
            label="Cancel"
            @click="deletePopup = false"
            :class="'secondaryButton'"
          ></Button>
          <Button
            :loading="loading"
            label="Delete device"
            :class="'primaryButtonDel'"
            type="submit"
            @click="del()"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>
  <div class="rectangle2">
    <DataTable
      :value="device"
      scrollDirection="vertical"
      scrollable
      :scrollHeight="calculateScreenHeight(0.75)"
      class="mt-2 text-[14px]"
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
              class="w-fit h-fit max-w-sm max-h-max"
            >
              <img
                v-if="rowData.data.location"
                :src="rowData.data.location.dataURL"
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
              class="w-7 h-7"
              severity="warning"
              @click="
                showPopup = true;
                Object.assign(form, rowData.data);
              "
            />
            <Button
              icon="pi pi-trash"
              rounded
              class="w-7 h-7"
              severity="danger"
              @click="
                deletePopup = true;
                selectDelDevice = rowData.data;
              "
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
    :draggable="false"
    :closable="!loading"
    close-on-escape
    @after-hide="Object.assign(form, initialFormDevice)"
    :pt="{
      content: {
        style:
          'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
      },
      header: {
        style: 'border-top-left-radius: 20px; border-top-right-radius: 20px;  ',
      },
      mask: {
        style: 'backdrop-filter: blur(2px)',
      },
    }"
  >
    <div class="flex flex-col gap-2 h-[90px]">
      <div class="inline-block">
        <label for="deviceName" class="text-primary-50 font-medium">
          Device Name
        </label>
        <label for="deviceName" class="text-[#FF0000] font-medium"> * </label>
      </div>
      <InputText
        v-model:model-value="form.deviceName"
        @keydown="
          (e) => {
            limitCharDevice = form.deviceName?.length === 8;
          }
        "
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="Max 8 Character Ex.CPE01 "
        maxlength="8"
        :class="{
          'border-red-500 shadow-none':
            form.deviceName?.length === 8 && limitCharDevice,
        }"
        id="deviceName"
      ></InputText>
      <div class="text-red-500 -mt-5 text-[12px]" tyle="min-height: 1rem;">
        <div v-if="form.deviceName?.length === 8 && limitCharDevice">
          You have reached the character limit.
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 h-[90px]">
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
    <div class="flex flex-col gap-2 h-[90px]">
      <div class="inline-block">
        <label for="macAddress" class="text-primary-50 font-medium">
          Room
        </label>
        <label for="deviceName" class="text-[#FF0000] font-medium"> * </label>
      </div>
      <InputText
        v-model:model-value="form.room"
        @keydown="
          (e) => {
            limitCharRoom = form?.room?.length === 3;
            if (e.key !== 'Backspace' && !/^\d$/.test(e.key)) {
              isNumber = false;
              e.preventDefault();
            } else {
              isNumber = true;
            }
          }
        "
        class="border border-[#C6C6C6] p-2 text-primary-50 w-full rounded-lg mb-3"
        placeholder="Number only Ex.516"
        maxlength="3"
        :class="{
          'border-red-500 shadow-none':
            (form?.room?.length && form.room.length >= 3 && limitCharRoom) ||
            !isNumber,
        }"
      ></InputText>
      <div class="text-red-500 -mt-5 text-[12px]" tyle="min-height: 1rem;">
        <div
          v-if="form?.room?.length && form.room.length >= 3 && limitCharRoom"
        >
          You have reached the character limit.
        </div>
        <div v-else-if="!isNumber">Type the number using digits 0-9 only.</div>
      </div>
    </div>
    <div class="flex flex-col gap-1 h-[90px]">
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
        <template #content="{ removeFileCallback }">
          <div
            v-if="form.location"
            class="flex justify-between items-center w-full"
          >
            <img
              alt="locationImage"
              :src="form.location.dataURL"
              class="w-2/4 h-2/4"
            />
            <Button
              icon="pi pi-times"
              @click="
                removeFileCallback(0);
                form.location = null;
              "
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
        :disabled="!form.deviceName || !form.room"
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

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
}

.primaryButtonDel:hover {
  background-color: rgb(193, 0, 0);
  text-decoration-line: underline;
}

.primaryButton:hover {
  background-color: rgb(37, 135, 240);
  text-decoration-line: underline;
}

.header-popup {
  font-weight: 700;
  font-size: 22px;
  color: rgb(255, 0, 0);
}
</style>

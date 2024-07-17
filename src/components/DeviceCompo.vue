<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DeviceCompo",
});
</script>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import store from "@/store";
import { deleteDevice } from "@/services";
import { Device } from "@/types";
import { initialFormDevice, calculateScreenHeight } from "@/utils/constant";
import { useToast } from "primevue/usetoast";
import ModalAddEditDevice from "@/components/Modal/ModalAddEditDevice.vue";

const form = reactive({ ...initialFormDevice });
const device = computed(() => store.state.devices);
const showPopup = ref(false);
const toast = useToast();
const loading = ref(false);
const deletePopup = ref(false);
const selectDelDevice = ref<Device>();

const toggleOverlay = (e: any, panel: any) => {
  panel.toggle(e);
};

const closeModalAddEditDevice = () => {
  showPopup.value = false;
};

const del = async () => {
  loading.value = true;
  const res = await deleteDevice(selectDelDevice.value?.MACaddress || "");
  toast.add({
    severity: "success",
    summary: "Delete success",
    detail: `Delete ${selectDelDevice.value?.deviceName} success`,
    life: 3000,
  });
  loading.value = false;
  deletePopup.value = false;
  selectDelDevice.value = undefined;
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
    class="w-[400px]"
    :pt="{
      content: {
        style:
          'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
      },
      header: {
        style: 'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
      },
    }"
  >
    <template #header>
      <div class="header-popup">
        Delete "{{ selectDelDevice?.deviceName }}" device?
      </div>
    </template>
    <div class="flex flex-col gap-2 text-[14px]">
      <div>
        Deleting this device will also remove all contents associated with it,
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
            icon="pi pi-trash"
            :class="'primaryButtonDel justify-center'"
            :pt="{ label: { class: 'flex-none ml-2' } }"
            type="submit"
            @click="del()"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>
  <div class="rectangle2 flex flex-col">
    <DataTable
      :value="device"
      scrollDirection="vertical"
      scrollable
      :scrollHeight="calculateScreenHeight(0.75)"
      class="mt-2 text-[12px] lg:text-[14px]"
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
            <p class="font-normal">{{ rowData.data.deviceName }}</p>
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
              class="w-fit h-fit max-w-sm max-h-max text-[12px]"
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
            <p class="font-normal">
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
                Object.assign(form, rowData.data);
                showPopup = true;
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
  <ModalAddEditDevice
    :show="showPopup"
    :isEdit="true"
    :dataEdit="form"
    :onClose="closeModalAddEditDevice"
  />
</template>

<style scoped>
.rectangle2 {
  width: 100%;
  height: 100%;
}

.bold-ho:hover {
  font-weight: 600;
  background-color: #e2e2e2;
}

.bold-ho-add:hover {
  font-weight: 600;

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
  font-size: 14px;
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
  margin-top: 20px;
  background-color: none;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: white;
  color: rgb(255, 91, 91);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButtonDel:hover {
  background-color: rgb(255, 235, 235);
}

.primaryButton:hover {
  background-color: rgb(37, 135, 240);
}

.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: rgb(255, 91, 91);
}
</style>

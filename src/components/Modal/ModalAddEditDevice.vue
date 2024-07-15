<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ModalAddEditDevice",
});
</script>

<script setup lang="ts">
import { addDevicePi, addDeviceTV, editDevice } from "@/services";
import store from "@/store";
import { onUpload, initialFormDevice } from "@/utils/constant";
import InputMask from "primevue/inputmask";
import { useToast } from "primevue/usetoast";
import { computed, reactive, ref, defineProps, watch } from "vue";
import { filesize } from "filesize";
import { Device } from "@/types";
type Props = {
  show: boolean;
  onClose: () => void;
  isEdit?: boolean;
  dataEdit?: Device;
};
const props = defineProps<Props>();
const form = reactive({ ...initialFormDevice });
const loading = ref(false);
const manualMac = ref(false);
const macNotUse = computed(() => store.state.macNotUse);
const limitCharRoom = ref(false);
const limitCharDevice = ref(false);
const showPopup = ref(false);
const toast = useToast();

watch(props, () => {
  showPopup.value = props.show;
  if (props.dataEdit) {
    Object.assign(form, props.dataEdit);
  }
});

const resetForm = () => {
  props.onClose();
  Object.assign(form, initialFormDevice);
};

const addOrEdit = async () => {
  const invalidName = !form.deviceName?.replace(" ", "").length;
  const invalidRoom = !form.room?.replace(" ", "").length;
  if (invalidName || invalidRoom) {
    toast.add({
      severity: "error",
      summary: "Invalid Input",
      detail: `${invalidName ? "Device Name" : "Room"} Invalid"`,
      life: 3000,
    });
    return;
  }

  loading.value = true;
  if (form.location?.dataURL) {
    const fileExtension = form.location.type.split("/")[1];
    form.location.name = `${form.MACaddress}.${fileExtension}`;
  } else if (form.location) {
    form.location.name = `${form.MACaddress}.${form.location.name
      .split(".")
      .pop()}`;
  }

  let res;
  if (props.isEdit) {
    res = await editDevice(form);
  } else if (manualMac.value) {
    res = await addDeviceTV(form);
  } else {
    res = await addDevicePi(form);
  }
  if (res.ok) {
    props.onClose();
    toast.add({
      severity: "success",
      summary: "Success",
      detail: res.message,
      life: 3000,
    });
    resetForm();
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

const errorSelectFile = () => {
  toast.add({
    severity: "error",
    summary: "Invalid file type",
    detail: "Allowed file types: image/*.",
    life: 3000,
  });
};
</script>

<template>
  <Toast />
  <Dialog
    v-model:visible="showPopup"
    class="w-[600px] h-auto"
    modal
    close-on-escape
    :draggable="false"
    :closable="!loading"
    @after-hide="resetForm()"
    :pt="{
      content: {
        style:
          'border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; ',
      },
      header: {
        style: 'border-top-left-radius: 20px; border-top-right-radius: 20px;  ',
      },
    }"
  >
    <template #header>
      <div class="header-popup">{{ isEdit ? "Edit" : "Add" }} Device</div>
    </template>
    <div class="text-[14px]">About device</div>
    <div
      class="bg-white p-4 mt-2 mb-4 gap-5 flex flex-col h-full w-full rounded-lg items-start justify-start"
      style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
    >
      <div class="flex w-full flex-col gap-2 text-[14px] h-fit">
        <div class="inline-block">
          <label class="text-primary-50 font-medium"> Device Name </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <InputText
          v-model:model-value="form.deviceName"
          class="h-8 w-full mb-3 rounded-[8px] text-[12px]"
          placeholder="Limit 8 characters Ex.CPE01 "
          maxlength="8"
          :class="{
            'border-red-500 shadow-none':
              form.deviceName?.length === 8 && limitCharDevice,
          }"
        ></InputText>
        <div class="text-red-500 -mt-5 text-[12px]" tyle="min-height: 1rem;">
          <div v-if="form.deviceName?.length === 8 && limitCharDevice">
            You have reached the character limit.
          </div>
        </div>
      </div>
      <div v-if="!isEdit" class="flex flex-col w-full text-[14px] gap-2 h-fit">
        <div class="inline-flex">
          <label class="text-primary-50 font-medium"> Device type </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <Dropdown
          v-model:model-value="manualMac"
          :options="[
            { label: 'Smart TV', value: true },
            { label: 'Raspberry Pi', value: false },
          ]"
          optionLabel="label"
          optionValue="value"
          :placeholder="'Select a MAC Address Type'"
          class="-mt-1"
        />
      </div>
      <div class="flex text-[14px] w-full flex-col gap-2 h-fit">
        <div class="inline-flex">
          <label class="text-primary-50 text-[14px] font-medium">
            {{
              isEdit
                ? "MAC Address"
                : manualMac
                ? "MAC Address TV"
                : "MAC Address Raspberry Pi"
            }}
          </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <InputText
          v-if="isEdit"
          v-model="form.MACaddress"
          class="h-8 w-full rounded-[8px] text-[12px] !text-[#a1a1a1] cursor-not-allowed"
          disabled
        ></InputText>
        <InputMask
          v-else-if="manualMac"
          mask="**:**:**:**:**:**"
          v-model="form.MACaddress"
          class="h-8 w-full rounded-[8px] text-[12px]"
          placeholder="Ex.ff:ff:ff:ff:ff:ff"
        />
        <Dropdown
          v-else
          v-model:model-value="form.MACaddress"
          :options="macNotUse"
          :placeholder="
            macNotUse.length
              ? 'Select a MAC Address'
              : 'All Raspberry Pi has already been added'
          "
          :disabled="!macNotUse.length"
          class="-mt-1"
        />
      </div>
    </div>
    <div class="text-[14px]">Device location</div>
    <div
      class="bg-white p-4 mt-2 gap-7 flex flex-col h-full w-full rounded-lg items-start justify-start"
      style="box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px"
    >
      <div class="flex flex-col w-full text-[14px] gap-2 h-fit">
        <div class="inline-block">
          <label class="text-primary-50 font-medium"> Room </label>
          <label class="text-[#FF0000] font-medium"> * </label>
        </div>
        <InputText
          v-model:model-value="form.room"
          class="h-8 w-full rounded-[8px] text-[12px]"
          placeholder="Limit 5 characters Ex.516"
          maxlength="5"
          :class="{
            'border-red-500 shadow-none':
              form?.room?.length && form.room.length > 5 && limitCharRoom,
          }"
        ></InputText>
        <div
          class="text-red-500 -mt-5 text-[12px]"
          tyle="min-height: 1rem;"
        ></div>
      </div>

      <div class="flex flex-col w-full gap-1 fix text-[14px] h-fit">
        <label class="text-primary-50 font-medium">
          Location Description
        </label>
        <InputText
          v-model:model-value="form.description"
          class="h-8 w-full rounded-[8px] text-[12px]"
          placeholder="(Optional)"
        ></InputText>
      </div>
      <div class="flex flex-col w-full text-[14px] -mt-2 h-fit gap-1">
        <label class="text-primary-50 font-medium">
          Location Photo (Optional)
        </label>
        <FileUpload
          accept="image/*"
          customUpload
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
            <Button
              @click="
                clearCallback();
                chooseCallback();
              "
              icon="pi pi-plus text-[14px]"
              label="Choose File"
              class="rounded-2xl h-fit w-fit text-[14px] border-[#14C6A4] text-[#14C6A4] font-bold hover:bg-[#14C6A433]"
              outlined
            />
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
              <div class="w-fit">{{ filesize(form.location.size) }}</div>
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
              <p class="mt-4 mb-0 text-[14px]">
                Drag and drop files to here to upload.
              </p>
            </div>
          </template>
        </FileUpload>
      </div>
    </div>
    <div class="flex flex-row gap-4 pt-3">
      <Button
        label="Cancel"
        text
        @click="resetForm()"
        :class="'secondaryButton'"
      ></Button>
      <Button
        :loading="loading"
        :label="isEdit ? 'Done' : 'Add'"
        :icon="isEdit ? '' : 'pi pi-plus'"
        :class="'primaryButton justify-center'"
        :pt="{ label: { class: 'flex-none mr-2' } }"
        @click="addOrEdit"
        :disabled="!form.MACaddress || !form.deviceName || !form.room"
      ></Button>
    </div>
  </Dialog>
</template>

<style scoped>
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
  background-color: #14c6a4;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.primaryButton:hover {
  cursor: pointer;
  background-color: #0eb092;
}

.header-popup {
  font-weight: 700;
  font-size: 20px;
  color: #049a7e;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import { addEmergency, addPoster } from "@/services";
import store from "@/store";
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";

const loading = ref(false);
const toast = useToast();
const formPoster = computed(() => store.state.formPoster);
const formDisplay = computed(() => store.state.formDisplay);
const formEmer = computed(() => store.state.formEmer);

const validateForm = () => {
  if (
    (!formPoster.value.title || !formPoster.value.image) &&
    (!formEmer.value.incidentName || !formEmer.value.emergencyImage)
  ) {
    return "Title Invalid or Not Choose File Image.";
  }

  const invalidSchedule = formDisplay.value.find(
    (e) =>
      (!e.MACaddress.length && !e.allDevice) ||
      !e.duration ||
      !e.startDate ||
      !e.endDate
  );

  if (invalidSchedule) {
    return "Schedule Invalid.";
  }
};

const handleAddEmergency = async () => {
  const res = await addEmergency(formEmer.value);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Emergency has been add successfully.",
      life: 3000,
    });
    store.commit("resetForm");
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

const handleAddPoster = async () => {
  formDisplay.value.forEach((e, i) => {
    if (e.allDay) store.commit("setAllTime", i);
    if (e.allDevice) store.commit("setAllDevice", i);
  });

  const res = await addPoster(formPoster.value, formDisplay.value);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Poster has been add successfully.",
      life: 3000,
    });
    store.commit("resetForm");
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

const add = async () => {
  loading.value = true;
  if (formEmer.value.incidentName && formEmer.value.emergencyImage) {
    handleAddEmergency();
  } else if (
    formPoster.value.title &&
    formPoster.value.image &&
    !formDisplay.value.find(
      (e) =>
        (!e.MACaddress.length && !e.allDevice) ||
        !e.duration ||
        !e.startDate ||
        !e.endDate
    )
  ) {
    handleAddPoster();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: validateForm(),
      life: 3000,
    });
    loading.value = false;
  }
};
</script>

<template>
  <Toast />
  <div
    class="bg-[#F6F6F6] border-t border-[#c7bbbb] h-14 px-6 flex items-center font-sf-pro"
  >
    <ul
      v-if="$route.path === '/uploadfile'"
      class="flex items-center justify-end w-full"
    >
      <Button
        type="button"
        label="Upload"
        icon="pi pi-upload"
        :loading="loading"
        @click="add"
        class="bg-[#36BFA7] border-[#36BFA7] font-semibold font-sf-pro text-white gap-1 w-fit h-10 rounded-lg flex items-center justify-center"
      />
    </ul>
  </div>
</template>

<style></style>

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

const message = ref();
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
    store.commit("resetForm");
  } else {
    message.value = res.message;
  }
};

const handleAddPoster = async () => {
  formDisplay.value.forEach((e, i) => {
    if (e.allDay) store.commit("setAllTime", i);
    if (e.allDevice) store.commit("setAllDevice", i);
  });

  const res = await addPoster(formPoster.value, formDisplay.value);
  if (res.ok) store.commit("resetForm");
  else message.value = res.message;
};

const add = async () => {
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
  } else alert(validateForm());
};
</script>

<template>
  <div
    class="bg-[#F6F6F6] border-t border-[#c7bbbb] h-14 px-6 flex items-center font-sf-pro"
  >
    <ul
      v-if="$route.path === '/uploadfile'"
      class="flex items-center justify-end w-full"
    >
      <Button
        @click="add"
        class="bg-teal border-teal font-semibold font-sf-pro text-white w-24 h-10 rounded-lg flex items-center justify-center"
        >Upload</Button
      >
    </ul>
  </div>
</template>

<style></style>

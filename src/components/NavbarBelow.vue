<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import { addEmergency, addPoster } from "@/services";
import store from "@/store";
import router from "@/router";
import { Poster } from "@/types";
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { createUnique, setFieldPoster } from "@/utils/constant";

const toast = useToast();
// const loading = ref(false);
// const posters = computed(() => store.state.posters);
// const formPoster = computed(() => store.state.formPoster);
// const formDisplay = computed(() => store.state.formDisplay);
// const formEmer = computed(() => store.state.formEmer);

// const validateForm = () => {
//   if (
//     (!formPoster.value.title || !formPoster.value.image) &&
//     (!formEmer.value.incidentName || !formEmer.value.emergencyImage)
//   ) {
//     return "Title Invalid or Not Choose File Image.";
//   }

//   const invalidSchedule = formDisplay.value.find(
//     (e) =>
//       (!e.MACaddress.length && !e.allDevice) ||
//       !e.duration ||
//       !e.startDate ||
//       !e.endDate
//   );

//   if (invalidSchedule) {
//     return "Schedule Invalid.";
//   }
// };

// const handleAddEmergency = async () => {
//   const res = await addEmergency(formEmer.value);
//   if (res.ok) {
//     toast.add({
//       severity: "success",
//       summary: "Success",
//       detail: "Emergency has been add successfully.",
//       life: 3000,
//     });
//     store.commit("resetForm");
//   } else {
//     toast.add({
//       severity: "error",
//       summary: "Error",
//       detail: res.message,
//       life: 3000,
//     });
//   }
//   loading.value = false;
// };

// const handleAddPoster = async () => {
//   formDisplay.value.forEach((e, i) => {
//     if (e.allDay) store.commit("setAllTime", i);
//     if (e.allDevice) store.commit("setAllDevice", i);
//   });

//   const res = await addPoster(formPoster.value, formDisplay.value);
//   if (res.ok) {
//     setFieldPoster(res.createPoster);
//     let newPoster = [] as Poster[];
//     formDisplay.value.forEach((e) => {
//       e.time.forEach((time) => {
//         e.MACaddress.forEach(async (mac) => {
//           newPoster.push({
//             ...res.createPoster,
//             MACaddress: mac,
//             startDate: e.startDate,
//             endDate: e.endDate,
//             startTime: time.startTime,
//             endTime: time.endTime,
//           });
//         });
//       });
//     });
//     store.state.posters.push(...newPoster);
//     createUnique(posters.value);
//     store.commit("resetForm");
//     toast.add({
//       severity: "success",
//       summary: "Success",
//       detail: "Poster has been add successfully.",
//       life: 3000,
//     });
//   } else {
//     toast.add({
//       severity: "error",
//       summary: "Error",
//       detail: res.message,
//       life: 3000,
//     });
//   }
//   loading.value = false;
// };

// const add = async () => {
//   loading.value = true;
//   if (formEmer.value.incidentName && formEmer.value.emergencyImage) {
//     handleAddEmergency();
//   } else if (
//     formPoster.value.title &&
//     formPoster.value.image &&
//     !formDisplay.value.find(
//       (e) =>
//         (!e.MACaddress.length && !e.allDevice) ||
//         !e.duration ||
//         !e.startDate ||
//         !e.endDate
//     )
//   ) {
//     handleAddPoster();
//   } else {
//     toast.add({
//       severity: "error",
//       summary: "Error",
//       detail: validateForm(),
//       life: 3000,
//     });
//     loading.value = false;
//   }
// };
</script>

<template>
  <Toast />
  <div
    class="bg-[#ffffff] border-t border-[#c7bbbb] h-14 px-6 flex items-center"
  >
    <ul
      v-if="$route.path.includes('/preview')"
      class="flex items-center justify-end w-full gap-3"
    >
      <Button
        type="button"
        label="About"
        icon="pi pi-info bg-[#039BE5] rounded-full text-white p-[4px] shadow-md"
        class="border-[hsl(0,0%,68%)] bg-white text-[#039BE5] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center"
      />
      <Button
        type="button"
        label="Edit"
        icon="pi pi-pencil bg-[#FF9900] rounded-full text-white p-[4px] shadow-md"
        class="border-[hsl(0,0%,68%)] bg-white text-[#FF9900] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center"
      />
      <Button
        type="button"
        label="Delete"
        icon="pi pi-trash bg-[#ff5e5e] rounded-full text-white p-[4px] shadow-md"
        class="border-[hsl(0,0%,68%)] bg-white text-[#ff5e5e] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center"
      />
    </ul>
  </div>
</template>

<style></style>

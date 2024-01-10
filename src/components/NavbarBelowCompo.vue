<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import { addEmergency } from "@/services/emergency";
import store from "@/store";
import { computed, ref } from "vue";

const message = ref();
const formNor = computed(() => store.state.formNor);
const formEmer = computed(() => store.state.formEmer);

const addPoster = async () => {
  if (!formEmer.value.incidentName || !formEmer.value.emergencyImage) {
    alert("Title Invalid or Not Choose File Image.");
  }
  const res = await addEmergency(formEmer.value);
  if (res.ok) {
    store.commit("resetForm");
  } else {
    message.value = res.message;
  }
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
        @click="addPoster"
        class="bg-teal border-teal font-semibold font-sf-pro text-white w-24 h-10 rounded-lg flex items-center justify-center"
        >Upload</Button
      >
    </ul>
  </div>
</template>

<style></style>

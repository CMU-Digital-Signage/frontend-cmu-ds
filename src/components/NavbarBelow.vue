<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { Poster } from "@/types";
import { computed, ref, defineModel, toRefs } from "vue";
import { useToast } from "primevue/usetoast";
import { dateFormatter, setNorForm } from "@/utils/constant";
import { deletePoster } from "@/services";

const poster = defineModel<Poster | undefined>({ default: undefined });
const toast = useToast();
const user = computed(() => store.state.userInfo);
const showInfo = ref(false);

const del = async () => {
  const res = await deletePoster(poster.value!.posterId);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Delete Poster successful.",
    life: 3000,
  });
};
</script>

<template>
  <Toast />
  <div
    class="bg-[#ffffff] border-t border-[#c7bbbb] h-14 px-6 flex items-center"
  >
    <ul
      v-if="$route.path.includes('/preview') && poster"
      class="inline-flex flex-1"
    >
      <Button
        label="Clear"
        class="border-[#adadad] bg-white text-[#9a9a9a] font-semibold min-w-fit h-10 rounded-lg px-5"
        @click="
          poster = undefined;
          store.state.filterInputPosters.date = new Date();
          store.state.filterInputPosters.time = new Date();
        "
      />

      <div class="flex items-center justify-end w-full gap-3">
        <Button
          label="About"
          icon="pi pi-info bg-[#039BE5] rounded-full text-white p-[4px] shadow-md"
          class="border-[#adadad] bg-white text-[#039BE5] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-gray-200"
          :disabled="!poster"
          @click="showInfo = true"
        />
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Edit"
          icon="pi pi-pencil bg-[#FF9900] rounded-full text-white p-[4px] shadow-md"
          class="border-[#adadad] bg-white text-[#FF9900] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-gray-200"
          @click="setNorForm(poster)"
        />
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Delete"
          icon="pi pi-trash bg-[#ff5e5e] rounded-full text-white p-[4px] shadow-md"
          class="border-[#adadad] bg-white text-[#ff5e5e] font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-gray-200"
          @click="del()"
        />
      </div>
    </ul>
  </div>
  <Dialog
    v-if="poster"
    v-model:visible="showInfo"
    modal
    :draggable="false"
    class="w-[500px] z-[100]"
  >
    <template #header>
      <div class="inline-flex font-bold text-2xl gap-3 items-center">
        <p>{{ poster.title }}</p>
        <p>({{ poster.type }})</p>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <!-- Number of Poster -->
      <div class="posterDetail">
        <p>Number of Poster</p>
        <p>{{ poster.image.length }} Posters</p>
      </div>
      <!-- Start Date -->
      <div class="posterDetail">
        <p>Start Date</p>
        <p>{{ dateFormatter(poster.startDate) }}</p>
      </div>
      <!-- End Date -->
      <div class="posterDetail">
        <p>End Date</p>
        <p>{{ dateFormatter(poster.endDate) }}</p>
      </div>
      <!-- Running Time -->
      <div class="posterDetail">
        <p>Running Time</p>
        <p
          v-if="
            poster.startTime.getHours() === 0 &&
            poster.endTime.getHours() === 23 &&
            poster.endTime.getMinutes() === 59
          "
        >
          All Day
        </p>
        <p v-else>
          {{ poster.startTime.toTimeString().slice(0, 5) }} -
          {{ poster.endTime.toTimeString().slice(0, 5) }}
        </p>
      </div>
      <!-- Duration -->
      <div class="posterDetail">
        <p>Display Duration</p>
        <p>{{ poster.duration * poster.image.length }} sec</p>
      </div>
      <!-- Description -->
      <div class="posterDetail">
        <p>Description</p>
        <p>{{ poster.description }}</p>
        <p v-if="!poster.description">-</p>
      </div>
      <!-- Uploader -->
      <div class="posterDetail">
        <p>Uploader</p>
        <p>{{ poster.uploader }}</p>
      </div>
    </div>
  </Dialog>
</template>

<style></style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { Poster } from "@/types";
import { computed, ref, defineModel } from "vue";
import { useToast } from "primevue/usetoast";
import { dateFormatter, setNorForm } from "@/utils/constant";
import { deletePoster } from "@/services";

const poster = defineModel<Poster | undefined>({ default: undefined });
const toast = useToast();
const user = computed(() => store.state.userInfo);
const showInfo = ref(false);
const deletePopup = ref(false);
const loading = ref(false);

const del = async () => {
  loading.value = true;
  await deletePoster(poster.value!.posterId);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Delete Poster successful.",
    life: 3000,
  });
  loading.value = false;
  deletePopup.value = false;
};
</script>

<template>
  <Toast />
  <Dialog
    v-model:visible="deletePopup"
    modal
    :closable="!loading"
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
        Delete
        {{ `"${poster?.title}" Poster` }}?
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div>
        Deleting this poster or collection will be permenently deleted from all
        devices.
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
            label="Delete Poster"
            :class="'primaryButtonDel'"
            type="submit"
            @click="del()"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>
  <div
    class="bg-[#ffffff] border-t border-[#c7bbbb] h-14 px-6 flex items-center"
  >
    <ul
      v-if="$route.path.includes('/preview') && poster"
      class="inline-flex flex-1"
    >
      <Button
        label="Clear"
        class="border-none bg-red-500 rounded-[8px] font-semibold min-w-fit h-10 px-5 hover:bg-red-600"
        @click="
          poster = undefined;
          store.commit('resetFilter');
        "
      />

      <div class="flex items-center justify-end w-full gap-3">
        <Button
          label="About"
          severity="primary"
          icon="pi pi-info  rounded-full text-white p-[4px]"
          class="border-none  text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-blue-600"
          @click="showInfo = true"
        />
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Edit"
          icon="pi pi-pencil bg-[#FF9900] rounded-full text-white p-[4px]"
          class="border-none bg-[#FF9900]  text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-amber-600"
          @click="setNorForm(poster)"
        />
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Delete"
          severity="danger"
          icon="pi pi-trash bg-[#D3302F] rounded-full text-white p-[4px]"
          class="border-none  text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-red-700"
          @click="deletePopup = true"
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
      <div class="inline-flex font-bold text-2xl gap-3 items-start">
        <div class="flex flex-col">
          <p>{{ poster.title }}</p>
          <p class="text-[16px] text-[#8d8d8d] -mt-1">
            {{ poster.type }}
          </p>
        </div>
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

      <!-- Uploader -->
      <div class="posterDetail">
        <p>Uploader</p>
        <p>{{ poster.uploader }}</p>
      </div>

      <!-- Description -->
      <div class="posterDetail flex-col gap-1">
        <p class="font-[800px] text-[#535353]">Description</p>
        <div class="bg-[#e9f2fd] rounded-lg p-3 px-5">
          <p class="font-notoThai">{{ poster.description }}</p>
          <p v-if="!poster.description">-</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.header-popup {
  font-weight: 700;
  font-size: 22px;
  color: rgb(255, 0, 0);
}

.primaryButtonDel {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  background-color: white;
  color: rgb(255, 0, 0);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
}

.primaryButtonDel:hover {
  background-color: rgb(224, 77, 77);
  color: white;
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
</style>

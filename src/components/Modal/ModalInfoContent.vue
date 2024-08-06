<script lang="ts">
import { defineComponent } from "vue";
import { MAP_TYPE } from "@/utils/enum";

export default defineComponent({
  name: "ModalInfoContent",
});
</script>

<script setup lang="ts">
import store from "@/store";
import { computed, defineProps, ref, watch } from "vue";
import { User } from "@/types";
import { deleteEmergency, deletePoster } from "@/services";
import { dateFormatter, setNorForm, typePoster } from "@/utils/constant";
import { useToast } from "primevue/usetoast";

type Props = {
  show: boolean;
  data: any;
  onClose: () => void;
  resetSelect?: () => void;
  haveAction?: boolean;
  deletecontent?: boolean;
};
const props = defineProps<Props>();
const user = computed<User>(() => store.state.userInfo);
const showPopup = ref(false);
const deletePopup = ref(false);
const loading = ref(false);
const toast = useToast();

watch(props, () => {
  showPopup.value = props.show;
  if (props.deletecontent) {
    deletePopup.value = props.deletecontent;
  }
});

const del = async () => {
  loading.value = true;
  let res;
  if (props.data.posterId) {
    res = await deletePoster(props.data.posterId);
  } else {
    res = await deleteEmergency(props.data.incidentName);
  }

  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete Poster successful.",
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
  props.resetSelect!();
  deletePopup.value = false;
};

const goToLink = () => {
  window.open(props.data.image[0].image, "_blank");
};
</script>

<template>
  <Toast />

  <!-- popup Delete -->
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
    }"
  >
    <template #header>
      <div class="header-popup">
        Delete
        {{ data?.posterId ? `"${data.title}"` : `"${data?.incidentName}"` }}?
      </div>
    </template>
    <div class="flex flex-col gap-2 text-[14px]">
      <div>
        Deleting this content will be permenently deleted from all devices.
      </div>
      <div class="inline-block">
        <div class="flex flex-row gap-4 pt-3">
          <Button
            text
            label="Cancel"
            :loading="loading"
            @click="onClose"
            :class="'secondaryButton'"
          ></Button>
          <Button
            :loading="loading"
            label="Delete Poster"
            icon="pi pi-trash"
            :class="'primaryButtonDel justify-center'"
            :pt="{ label: { class: 'flex-none ml-2' } }"
            type="submit"
            @click="del"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>

  <!-- popup Info -->
  <Dialog
    v-model:visible="showPopup"
    @after-hide="onClose()"
    modal
    :draggable="false"
    class="w-[400px] z-[100]"
    :pt="{
      header: {
        class: 'items-start rounded-t-lg  pt-3',
      },
      content: {
        class: 'px-5 pb-5 rounded-b-lg',
      },
    }"
  >
    <template #header>
      <div class="flex flex-col w-full">
        <div
          v-if="(user.isAdmin || user.id === data.userId) && haveAction"
          class="inline-flex gap-3 justify-end mr-[12px] mb-2"
        >
          <i
            class="pi pi-pencil cursor-pointer rounded-full p-2 hover:bg-gray-200"
            @click="
              setNorForm(data);
              showPopup = false;
            "
          ></i>
          <i
            class="pi pi-trash cursor-pointer rounded-full p-2 hover:bg-gray-200"
            @click="
              showPopup = false;
              deletePopup = true;
            "
          ></i>
        </div>

        <div class="inline-flex font-normal text-[22px] gap-3">
          <i
            v-if="data.color"
            class="pi pi-circle-fill mt-2"
            :style="{ color: data.color }"
          ></i>
          <div class="flex flex-col">
            <p>{{ data.title }}</p>
            <!-- Start Date to End Date -->
            <p class="text-[14px] font-medium text-[#575757]">
              <span
                >{{ dateFormatter(new Date(data.start ?? data.startDate), 3) }}
                -
              </span>
              <span>{{
                dateFormatter(new Date(data.end ?? data.endDate), 3)
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col text-[14px] gap-1 ml-4">
      <!-- Number of Poster -->
      <div
        v-if="[MAP_TYPE.POSTER, MAP_TYPE.WEBVIEW].includes(data.type)"
        class="posterDetail flex-row"
      >
        <i
          :class="`w-10 h-11 pi pi-${
            typePoster.find((e) => e.type == data.type)?.icon
          }`"
          style="font-size: 1.3rem"
        ></i>
        <p
          v-if="data.type == MAP_TYPE.WEBVIEW"
          @click="goToLink"
          class="cursor-pointer underline text-blue-500"
        >
          {{ data.image[0].image }}
        </p>
        <p v-else>
          {{ data.amount ?? data.image.length }}
          Poster{{ (data.amount ?? data.image.length) > 1 ? "s" : "" }}
        </p>
      </div>
      <!-- Running Time -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-clock"
          viewBox="0 0 30 32"
        >
          <path
            d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
          />
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
          />
        </svg>
        <p
          v-if="
            haveAction
              ? data.allDay
              : data.startTime.getHours() === 0 &&
                data.endTime.getHours() === 23 &&
                data.endTime.getMinutes() === 59
          "
        >
          All-day
        </p>
        <p v-else>
          {{
            haveAction
              ? `${data.startTime} - ${data.endTime}`
              : `${data.startTime.toTimeString().slice(0, 5)} - ${data.endTime
                  .toTimeString()
                  .slice(0, 5)}`
          }}
        </p>
      </div>
      <!-- Duration -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-play-circle"
          viewBox="0 0 30 32"
        >
          <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
          />
          <path
            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"
          />
        </svg>
        <div class="mt-[2px]">
          <p>{{ data.duration * (data.image?.length ?? 1) }} sec</p>
        </div>
      </div>
      <!-- Device -->
      <div class="posterDetail flex-row gap-1 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-display"
          viewBox="0 0 30 32"
        >
          <path
            d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"
          />
        </svg>
        <div class="mt-[2px]">
          <div class="flex flex-col">
            <p
              v-for="(item, index) in data.onDevice"
              :key="index"
              class="inline-flex justify-between gap-1"
            >
              <span>{{ item }}</span>
              <span>
                ({{
                  store.state.devices?.find((e) => e.deviceName === item)?.room
                }})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-person-add"
          viewBox="0 0 30 32"
        >
          <path
            d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
          />
          <path
            d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"
          />
        </svg>

        <div class="mt-[2px]">
          <p>{{ data.uploader }}</p>
        </div>
      </div>

      <!-- Description -->
      <div class="posterDetail flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="44"
          fill="currentColor"
          class="bi bi-text-paragraph"
          viewBox="0 0 30 32"
        >
          <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5"
          />
        </svg>
        <div class="mt-[2px]">
          <p>{{ data.description }}</p>
          <p v-if="!data.description">-</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: rgb(255, 91, 91);
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
  color: rgb(255, 91, 91);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}

.primaryButtonDel:hover {
  background-color: rgb(255, 235, 235);
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
  font-size: 14px;
}

.secondaryButton:hover {
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}
</style>

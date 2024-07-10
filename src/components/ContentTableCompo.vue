<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ContentTable",
});
</script>
<script setup lang="ts">
import { ref, computed, defineProps, watch, onMounted } from "vue";
import store from "@/store";
import {
  dateFormatter,
  typePoster,
  statusEmer,
  setNorForm,
  setEmerForm,
} from "@/utils/constant";
import { TYPE } from "@/utils/enum";
import { User } from "@/types";
import { statusPoster, calculateScreenHeight } from "@/utils/constant";
import { deletePoster, deleteEmergency } from "@/services";
import { useToast } from "primevue/usetoast";

const isOverlayPanelVisible = ref();
const toggleShowStatus = (e: any) => {
  isOverlayPanelVisible.value.toggle(e);
};
const loading = ref(false);
const props = defineProps({ types: String });
const deletePopup = ref(false);
const selectPoster = ref<any>();
const showInfo = ref(false);
const poster = ref();

const filterInput = computed(() => store.state.filterInputPosters);
const emerPosters = computed(() =>
  store.state.emerPosters?.filter((e) => {
    return (
      e.incidentName !== "banner" &&
      (!filterInput.value.title ||
        e.incidentName
          .toLowerCase()
          .includes(filterInput.value.title.toLowerCase())) &&
      (!filterInput.value.status || e.status === filterInput.value.status)
    );
  })
);
const uniquePosters = computed(() =>
  store.state.uniquePosters?.filter((e) => {
    return (
      (!filterInput.value.title ||
        e.title
          .toLowerCase()
          .includes(filterInput.value.title.toLowerCase())) &&
      (!filterInput.value.uploader.toLowerCase() ||
        e.uploader
          .toLowerCase()
          .includes(filterInput.value.uploader.toLowerCase())) &&
      (!filterInput.value.uploadDate ||
        dateFormatter(e.createdAt) ===
          dateFormatter(filterInput.value.uploadDate)) &&
      (!filterInput.value.type || e.type === filterInput.value.type) &&
      (!filterInput.value.status || e.status === filterInput.value.status)
    );
  })
);

const user = computed<User>(() => store.state.userInfo);
const toast = useToast();
let delP = "";

watch(selectPoster, () => {
  if (selectPoster.value) {
    poster.value = store.state.posters?.find(
      (e) => e.posterId === selectPoster.value.posterId
    );
  }
});

const del = async () => {
  loading.value = true;
  if (props.types == "NP") {
    const res = await deletePoster(selectPoster.value.posterId || "");
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
  } else {
    const res = await deleteEmergency(selectPoster.value.incidentName || "");
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Delete Emergency successful.",
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
  }
  loading.value = false;
  delP = "";
  selectPoster.value = undefined;
  deletePopup.value = false;
};
</script>

<template>
  <!-- popup Delete -->
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
        Delete
        {{
          selectPoster?.posterId
            ? `"${selectPoster.title}"`
            : `"${selectPoster?.incidentName}"`
        }}?
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
            @click="deletePopup = false"
            :class="'secondaryButton'"
          ></Button>
          <Button
            :loading="loading"
            label="Delete Poster"
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

  <!-- popup Info -->
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
          <p>{{ selectPoster.title }}</p>
          <p class="text-[16px] text-[#8d8d8d] -mt-1">
            {{ selectPoster.type }}
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

  <DataTable
    :value="props.types === 'NP' ? uniquePosters : emerPosters"
    scrollDirection="vertical"
    scrollable
    scrollHeight="flex"
    :virtualScrollerOptions="{ itemSize: (uniquePosters?.length || 1)+35 }"
    :class="`text-[12px] lg:text-[14px] flex-1 ${user.isAdmin ? '' : 'py-2'}`"
  >
    <Column
      :field="(e) => (props.types === 'NP' ? e.title : e.incidentName)"
      header="Title"
      sortable
      :class="`${props.types === 'NP' ? 'w-1/5' : 'w-1/3'}`"
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
    </Column>
    <Column
      v-if="props.types === 'NP'"
      field="uploader"
      header="Uploader"
      sortable
      class="w-1/5 "
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
    </Column>
    <Column
      v-if="props.types === 'NP'"
      :field="(e) => dateFormatter(e.createdAt)"
      header="Upload Date"
      sortable
      class="w-1/5 "
    >
      <template #sorticon="slotProps">
        <i
          class="m-3 pi"
          :class="{
            'pi-sort-alt': slotProps.sortOrder === 0,
            'pi-sort-numeric-up': slotProps.sortOrder === 1,
            'pi-sort-numeric-down': slotProps.sortOrder === -1,
          }"
        ></i>
      </template>
    </Column>

    <Column
      v-if="props.types !== 'EP'"
      sortable
      header="Type"
      field="type"
      :class="`w-1/6`"
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
        <Tag
          rounded
          :icon="`pi pi-${
            rowData.data.type === TYPE.POSTER
              ? 'images'
              : rowData.data.type === TYPE.VIDEO
              ? 'video'
              : 'link'
          }`"
          :value="rowData.data.type"
          :severity="
            typePoster.find((e) => rowData.data.type === e.type)?.severity
          "
          :pt="{
            value: 'text-[12px]',
          }"
        />
      </template>
    </Column>
    <Column
      field="status"
      :class="`${props.types === 'NP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #header>
        <div>Status</div>
        <i
          v-if="store.state.selectTabview === 0"
          class="pi pi-info-circle cursor-pointer ml-1"
          @mouseover="(e) => toggleShowStatus(e)"
          @mouseleave="(e) => toggleShowStatus(e)"
        ></i>
        <OverlayPanel
          class="w-fit h-fit max-w-full max-h-full text-[12px] p-2 rounded-lg"
          ref="isOverlayPanelVisible"
        >
          <div class="flex flex-col gap-3">
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[12px]',
                }"
                severity="success"
                value="Displayed"
              />
              <p class="mt-1">Poster is currently being displayed.</p>
            </div>
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[12px]',
                }"
                severity="danger"
                value="Expired"
              />
              <p class="mt-1">
                Posters are no longer scheduled to be displayed.
              </p>
            </div>
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[12px]',
                }"
                severity="info"
                value="Awaited"
              />
              <p class="mt-1">
                Posters will be displayed at a later date or time.
              </p>
            </div>
          </div>
        </OverlayPanel>
      </template>

      <template #body="rowData">
        <Tag
          rounded
          :value="rowData.data.status"
          :severity="
            props.types === 'NP'
              ? statusPoster.find((e) => rowData.data.status === e.status)
                  ?.severity
              : statusEmer.find((e) => rowData.data.status === e.status)
                  ?.severity
          "
          :pt="{
            value: 'text-[12px]',
          }"
        />
      </template>
    </Column>

    <Column
      field="management"
      header="Action"
      :class="`${props.types === 'NP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #body="rowData">
        <div class="flex gap-3">
          <Button
            v-if="
              (user.isAdmin && store.state.selectTabview === 0) || !user.isAdmin
            "
            icon="pi pi-info"
            rounded
            class="w-5 h-5 md:w-7 md:h-7"
            severity="primary"
            @click="
              selectPoster = rowData.data;
              showInfo = true;
            "
          />
          <Button
            v-if="user.isAdmin || user.id === rowData.data.id"
            icon="pi pi-pencil"
            rounded
            class="w-5 h-5 md:w-7 md:h-7"
            severity="warning"
            @click="
              props.types === 'NP'
                ? setNorForm(rowData.data)
                : setEmerForm(rowData.data)
            "
          />
          <Button
            v-if="user.isAdmin || user.id === rowData.data.id"
            icon="pi pi-trash"
            rounded
            class="w-5 h-5 md:w-7 md:h-7"
            severity="danger"
            :loading="
              loading &&
              (rowData.data.posterId === delP ||
                rowData.data.incidentName === delP)
            "
            @click="
              selectPoster = rowData.data;
              deletePopup = true;
            "
          />
        </div>
      </template>
    </Column>
  </DataTable>
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FileTableCompo",
});
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, watch, computed, onMounted } from "vue";
import store from "@/store";
import router from "@/router";
import {
  dateFormatter,
  statusEmer,
  setNorForm,
  setEmerForm,
} from "@/utils/constant";
import { Display, Emergency, Poster, User } from "@/types";
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
const selectDelPoster = ref<any>();

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
        e.createdAt === filterInput.value.uploadDate) &&
      (!filterInput.value.status || e.status === filterInput.value.status)
    );
  })
);
const formDisplay = computed(() => store.state.formDisplay);
const user = computed<User>(() => store.state.userInfo);
const toast = useToast();
let delP = null as any;

const del = async () => {
  loading.value = true;
  if (props.types == "NP") {
    const res = await deletePoster(selectDelPoster.value.posterId || "");
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete Poster successful.",
      life: 3000,
    });
  } else {
    const res = await deleteEmergency(selectDelPoster.value.incidentName || "");
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete Emergency successful.",
      life: 3000,
    });
  }
  loading.value = false;
  delP = null;
  selectDelPoster.value = undefined;
  deletePopup.value = false;
};
</script>

<template>
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
          style:
            'border-top-left-radius: 20px; border-top-right-radius: 20px; ',
        },
        mask: {
          style: 'backdrop-filter:  brightness(50%) grayscale(100%) contrast(150%) blur(3px)',
        },
      }"
    >
      <template #header>
        <div class="header-popup">
          Delete
          {{
            selectDelPoster?.posterId
              ? `"${selectDelPoster.title}" Poster`
              : `"${selectDelPoster?.incidentName}" Emergency Poster`
          }}?
        </div>
      </template>
      <div class="flex flex-col gap-2">
        <div>
          Deleting this poster or collection will be permenently deleted from all devices.
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
              :class="'primaryButtonDel'"
              type="submit"
              @click="del()"
            ></Button>
          </div>
        </div>
      </div>
    </Dialog>
  <DataTable
    :value="props.types === 'NP' ? uniquePosters : emerPosters"
    scrollDirection="vertical"
    scrollable
    :scrollHeight="calculateScreenHeight()"
    class="mt-2 text-[14px] lg:text-[16px]"
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
      v-if="user?.isAdmin && props.types === 'NP'"
      field="uploader"
      header="Uploader"
      sortable
      class="w-1/5"
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
      class="w-1/5"
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
          class="w-fit h-fit max-w-full max-h-full p-2 rounded-lg"
          ref="isOverlayPanelVisible"
        >
          <div class="flex flex-col gap-3">
            <div class="inline-flex gap-2">
              <Tag severity="success" value="Displayed" />
              <p class="mt-1">Poster is currently being displayed.</p>
            </div>
            <div class="inline-flex gap-2">
              <Tag severity="danger" value="Expired" />
              <p class="mt-1">
                Posters are no longer scheduled to be displayed.
              </p>
            </div>
            <div class="inline-flex gap-2">
              <Tag severity="info" value="Awaited" />
              <p class="mt-1">
                Poster will be displayed at a later date or time.
              </p>
            </div>
          </div>
        </OverlayPanel>
      </template>

      <template #body="rowData">
        <Tag
          :value="rowData.data.status"
          rounded
          :severity="
            props.types === 'NP'
              ? statusPoster.find((e) => rowData.data.status === e.status)
                  ?.severity
              : statusEmer.find((e) => rowData.data.status === e.status)
                  ?.severity
          "
        />
      </template>
    </Column>

    <Column
      field="management"
      header="Action"
      :class="`${props.types === 'NP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #body="rowData">
        <Button
          icon="pi pi-pencil"
          rounded
          class="w-8 h-8 md:w-9 md:h-9"
          severity="warning"
          @click="
            props.types === 'NP'
              ? setNorForm(rowData.data)
              : setEmerForm(rowData.data)
          "
        />
        <Button
          icon="pi pi-trash"
          rounded
          class="w-8 h-8 md:w-9 md:h-9 ml-[5px] md:ml-3"
          severity="danger"
          :loading="
            loading &&
            (rowData.data.posterId === delP ||
              rowData.data.incidentName === delP)
          "
          @click="
            deletePopup = true;
            selectDelPoster = rowData.data;
          "
        />
      </template>
    </Column>

  </DataTable>
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
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  margin-left: 10px;
}

.primaryButtonDel:hover {
  background-color: rgb(193, 0, 0);
  text-decoration-line: underline;
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

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ContentTable",
});
</script>
<script setup lang="ts">
import { ref, computed, defineProps, watch } from "vue";
import store from "@/store";
import {
  dateFormatter,
  typePoster,
  statusPoster,
  statusEmer,
  setNorForm,
  setEmerForm,
} from "@/utils/constant";
import { TYPE, MAP_TYPE } from "@/utils/enum";
import { User } from "@/types";
import ModalInfoContent from "@/components/Modal/ModalInfoContent.vue";

const props = defineProps({ types: String });
const user = computed<User>(() => store.state.userInfo);
const selectPoster = ref<any>();
const poster = ref();
const loading = ref(false);
const deletePopup = ref(false);
const showInfo = ref(false);
const isOverlayPanelVisible = ref();
const toggleShowStatus = (e: any) => {
  isOverlayPanelVisible.value.toggle(e);
};
let delP = "";

const filterInput = computed(() => store.state.filterInputPosters);
const emerPosters = computed(() =>
  store.state.emerPosters?.filter((e) => {
    return (
      e.incidentName !== "banner" &&
      (!filterInput.value.title ||
        e.incidentName
          .toLowerCase()
          .includes(filterInput.value.title.toLowerCase())) &&
      (!filterInput.value.status?.length ||
        filterInput.value.status.includes(e.status as string))
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
      (!filterInput.value.type?.length ||
        filterInput.value.type.includes(e.type)) &&
      (!filterInput.value.status?.length ||
        filterInput.value.status.includes(e.status))
    );
  })
);

watch(selectPoster, () => {
  if (selectPoster.value) {
    poster.value = store.state.posters?.find(
      (e) => e.posterId === selectPoster.value.posterId
    );
    const onDevice = store.state.posters
      ?.filter((e) => e.posterId == selectPoster.value.posterId)
      .map((e) => e.MACaddress);
    poster.value.onDevice = store.state.devices
      ?.filter((e) => onDevice?.includes(e.MACaddress!))
      .map((e) => e.deviceName);
  }
});

const closeModalInfoContent = () => {
  showInfo.value = false;
  deletePopup.value = false;
};

const resetSelect = () => {
  selectPoster.value = undefined;
};
</script>

<template>
  <ModalInfoContent
    :show="showInfo"
    :data="poster"
    :onClose="closeModalInfoContent"
    :resetSelect="resetSelect"
    :deletecontent="deletePopup"
  />

  <DataTable
    :value="props.types !== 'EP' ? uniquePosters : emerPosters"
    scrollDirection="vertical"
    scrollable
    scrollHeight="flex"
    :virtualScrollerOptions="{
      itemSize: uniquePosters?.length ? uniquePosters.length + 40 : 0,
    }"
    :class="`text-[12px]  lg:text-[14px] flex-1 ${user.isAdmin ? '' : 'py-2'}`"
  >
    <template #empty>
      <div
        v-if="uniquePosters.length === 0"
        class="flex flex-1 gap-10 justify-center items-center h-full"
      >
        <div class="flex flex-col">
          <p class="text-[18px] font-semibold text-[#575757]">
            No results found
          </p>
        </div>
        <img
          class="w-[420px] h-[420px]"
          alt="cmulogo"
          src="../assets/images/notFound.jpg"
        />
      </div>
    </template>
    <Column
      :field="(e) => (props.types !== 'EP' ? e.title : e.incidentName)"
      header="Title"
      sortable
      :class="`${props.types !== 'EP' ? 'w-1/5' : 'w-1/3'}`"
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
      v-if="props.types !== 'EP'"
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
      v-if="props.types !== 'EP'"
      :field="(e) => dateFormatter(e.createdAt)"
      header="Upload Date"
      sortable
      :sortField="(e) => e.createdAt.getTime()"
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
            typePoster.find((e) => e.type == rowData.data.type)?.icon
          }`"
          :value="TYPE[rowData.data.type as MAP_TYPE]"
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
      :class="`${props.types !== 'EP' ? 'w-[13%]' : 'w-1/3'}`"
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
          class="w-fit bg h-fit max-w-full max-h-full text-[12px] p-2 rounded-lg"
          ref="isOverlayPanelVisible"
        >
          <div class="flex flex-col gap-3">
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[13px]',
                }"
                severity="success"
                value="Displayed"
              />
              <p class="mt-1">
                Poster is
                <span class="font-semibold text-[#188A42]">currently</span>
                being displayed.
              </p>
            </div>
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[13px]',
                }"
                severity="danger"
                value="Expired"
              />
              <p class="mt-1">
                Posters are
                <span class="font-semibold text-[#b32b24]"
                  >no longer scheduled</span
                >
                to be displayed.
              </p>
            </div>
            <div class="inline-flex gap-2">
              <Tag
                :pt="{
                  value: 'text-[13px]',
                }"
                severity="info"
                value="Awaited"
              />
              <p class="mt-1">
                Posters
                <span class="font-semibold text-[#4070ba]"
                  >will be displayed</span
                >
                at a later date or time.
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
            props.types !== 'EP'
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
      :class="`${props.types !== 'EP' ? 'w-1/6' : 'w-1/3'}`"
    >
      <template #body="rowData">
        <div class="flex gap-3 items-center">
          <Button
            v-if="user.isAdmin || user.id === rowData.data.id"
            rounded
            outlined
            class="w-7 h-7 md:w-8 md:h-8 p-2 bg-transparent text-[#F39D4E] border-[#F39D4E] hover:bg-[#FDEBDC] flex items-center justify-center"
            severity="warning"
            @click="
              props.types !== 'EP'
                ? setNorForm(rowData.data)
                : setEmerForm(rowData.data)
            "
          >
            <i class="pi pi-pencil" style="font-size: 0.8rem"></i>
          </Button>
          <Button
            v-if="user.isAdmin || user.id === rowData.data.id"
            rounded
            outlined
            class="w-7 h-7 md:w-8 md:h-8 p-2 bg-transparent text-[#FF4747] border-[#FF4747] hover:bg-[#FFDADA] flex items-center justify-center"
            :loading="
              loading &&
              (rowData.data.posterId === delP ||
                rowData.data.incidentName === delP)
            "
            @click="
              selectPoster = rowData.data;
              deletePopup = true;
            "
          >
            <i class="pi pi-trash" style="font-size: 0.85rem"></i>
          </Button>
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

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { computed, ref, defineModel, watch } from "vue";
import { setNorForm } from "@/utils/constant";
import ModalInfoContent from "@/components/Modal/ModalInfoContent.vue";

const poster = defineModel<any>({ default: undefined });
const user = computed(() => store.state.userInfo);
const showInfo = ref(false);
const deletePopup = ref(false);

watch(poster, () => {
  if (poster.value) {
    const onDevice = store.state.posters
      ?.filter((e) => e.posterId == poster.value.posterId)
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
</script>

<template>
  <Toast />
  <div
    class="bg-none border-t-[1px] border-neutral-300 h-14 py-[26px] px-6 flex items-center"
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
        <!-- <Button
          label="About"
          severity="primary"
          icon="pi pi-info  rounded-full text-white p-[4px]"
          class="border-none text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-blue-600"
          @click="showInfo = true"
        /> -->
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Edit"
          icon="pi pi-pencil bg-[#FF9900] rounded-full text-white p-[4px]"
          class="border-none bg-[#FF9900] text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-amber-600"
          @click="setNorForm(poster)"
        />
        <Button
          v-if="user.isAdmin || user.id === poster?.id"
          label="Delete"
          severity="danger"
          icon="pi pi-trash bg-[#D3302F] rounded-full text-white p-[4px]"
          class="border-none text-white font-semibold gap-1 w-fit h-10 rounded-lg flex items-center justify-center hover:bg-red-700"
          @click="deletePopup = true"
        />
      </div>
    </ul>
  </div>
  <ModalInfoContent
    v-if="poster"
    :show="showInfo"
    :data="poster"
    :onClose="closeModalInfoContent"
    :deletecontent="deletePopup"
  />
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

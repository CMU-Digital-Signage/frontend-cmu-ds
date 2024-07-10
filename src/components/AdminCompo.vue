<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AdminCompo",
});
</script>
<script setup lang="ts">
import { ref, computed } from "vue";
import { deleteAdmin } from "@/services";
import { User } from "@/types";
import store from "@/store";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const loading = ref(false);
const deletePopup = ref(false);
const selectDelUser = ref<User>();
const user = ref<User>(store.state.userInfo);
const admin = computed(() =>
  store.state.allUser?.filter(
    (e) =>
      e.isAdmin &&
      (e.firstName?.toLowerCase().includes(search.value?.toLowerCase()) ||
        e.lastName?.toLowerCase().includes(search.value?.toLowerCase()) ||
        e.email.includes(search.value?.toLowerCase()))
  )
);
const search = ref("");
const isCurrentUser = (admin: User) => {
  return admin.id === user.value.id;
};

const del = async () => {
  loading.value = true;
  const res = await deleteAdmin(selectDelUser.value?.id || "");
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete admin successfully.",
      life: 3000,
    });
  }
  loading.value = false;
  deletePopup.value = false;
  selectDelUser.value = undefined;
};
</script>

<template>
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
        Delete "{{ selectDelUser?.firstName }} {{ selectDelUser?.lastName }}" ?
      </div>
    </template>
    <div class="flex flex-col gap-2 text-[14px]">
      <div>
        Deleting this user will not have access to all contents (except their own content), add device and add emergency content.
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
            label="Delete admin"
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
  <div class="rectangle2 flex flex-col">
    <div class="flex flex-row gap-2">
      <label
        for="macAddress"
        class="text-primary-50 text-[12px] font-semibold pt-[10px]"
        >Search
      </label>
      <InputText
        v-model="search"
        class="border border-[#C6C6C6] p-2 h-8 ml-2 mt-1 mb-3 w-96 text-[12px] rounded-lg"
        placeholder="Ex. Navadon Khunlertgit"
        type="text"
      ></InputText>
    </div>
    <DataTable
      :value="admin"
      scrollDirection="vertical"
      scrollable
      scrollHeight="flex"
      :virtualScrollerOptions="{ itemSize: (admin?.length || 1)+35 }"
      :class="`text-[12px] lg:text-[14px] flex-1 mt-2`"
    >
      <Column
        field="firstName"
        header="Name"
        sortable
        class="h-8 w-1/12"
        headerStyle="font-bold"
      >
        <template #sorticon="rowData">
          <i
            class="m-3 pi"
            :class="{
              'pi-sort-alt': rowData.sortOrder === 0,
              'pi-sort-alpha-down': rowData.sortOrder === 1,
              'pi-sort-alpha-up': rowData.sortOrder === -1,
            }"
          ></i>
        </template>
        <template #body="rowData">
          <p>{{ rowData.data.firstName }}</p>
          <p v-if="!rowData.data.firstName">{{ rowData.data.email }}</p>
        </template>
      </Column>
      <Column field="lastName" class="w-1/12"></Column>
      <Column :field="'isCurrentUser'" class="w-auto">
        <template #body="rowData">
          <div v-if="isCurrentUser(rowData.data)" class="py-1">(You)</div>
        </template>
      </Column>
      <Column header="Action" headerClass="w-1/2" :exportable="false">
        <template #body="rowData">
          <Button
            icon="pi pi-trash"
            rounded
            class="w-7 h-7"
            severity="danger"
            v-if="!isCurrentUser(rowData.data)"
            @click="
              deletePopup = true;
              selectDelUser = rowData.data;
            "
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.rectangle2 {
  width: 100%;
  height: 100%;
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

.primaryButton {
  width: 50%;
  border-width: 0;
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
  background-color: none;
  color: rgb(255, 255, 255);
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
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

.primaryButton:hover {
  background-color: rgb(37, 135, 240);
}

.header-popup {
  font-weight: 700;
  font-size: 18px;
  color: rgb(255, 91, 91);
}
</style>

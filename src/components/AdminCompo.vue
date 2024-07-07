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
import { calculateScreenHeight } from "@/utils/constant";

const toast = useToast();
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

const del = async (id: number) => {
  const res = await deleteAdmin(id);
  if (res.ok) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Delete admin successfully.",
      life: 3000,
    });
  }
};
</script>

<template>
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
      :virtualScrollerOptions="{ itemSize: 46 }"
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
            @click="del(rowData.data.id)"
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
</style>

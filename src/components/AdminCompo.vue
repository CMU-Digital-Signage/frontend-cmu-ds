<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AdminCompo",
});
</script>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { deleteAdmin } from "@/services";
import { User } from "@/types";
import store from "@/store";

const user = ref<User>(store.state.userInfo);
const admin = computed(() =>
  store.state.allUser.filter(
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
    store.commit("setAdmin", { id, isAdmin: false });
  }
};

const calculateScreenHeight = () => {
  const screenHeight = window.innerHeight;
  const multiplier = 0.69;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
};
</script>

<template>
  <div class="rectangle2">
    <div class="flex flex-row gap-2">
      <label for="macAddress" class="text-primary-50 font-semibold pt-2.5"
        >Search
      </label>
      <InputText
        v-model="search"
        class="border border-[#C6C6C6] p-2 h-9 ml-2 mt-1 w-96 rounded-lg"
        placeholder="Name"
        type="text"
      ></InputText>
    </div>
    <div class="rectangle3">
      <DataTable
        :value="admin"
        scrollDirection="vertical"
        scrollable
        :scrollHeight="calculateScreenHeight()"
        class="mt-2"
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
              class="w-9 h-9 mx-3"
              severity="danger"
              v-if="!isCurrentUser(rowData.data)"
              @click="del(rowData.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.rectangle2 {
  padding-bottom: 2rem;
}

.rectangle3 {
  flex: 1 1;
  padding-bottom: 0.5rem;
  margin-top: 10px;
  overflow-y: auto;
}

.box-admin {
  display: flex;
  background-color: #9dc75000; /* Adjust the background color as needed */
  padding-left: 1.5rem;
  height: 75px;
  align-items: center;
  border-bottom: 2px solid #dbdbdb;
  padding-right: 4.5rem;
}

.circle {
  width: 40px; /* Adjust the width and height as needed */
  height: 40px;
  border-radius: 50%; /* This makes the element circular */
  background-color: #3671bf; /* Set your desired background color */
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-button:hover {
  background-color: #1369da;
}
</style>

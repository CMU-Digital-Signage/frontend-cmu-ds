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
      (e.firstName.toLowerCase().includes(search.value?.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.value?.toLowerCase()))
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
  const multiplier = 0.71;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
};
</script>

<template>
  <div ref="containerRef" class="rectangle4 flex-1 font-sf-pro">
    <div class="flex flex-row gap-2">
      <label for="macAddress" class="text-primary-50 font-semibold pt-2"
        >Search:
      </label>
      <InputText
        v-model="search"
        class="border border-[#C6C6C6] p-2 h-9 ml-2 mt-1 w-72 rounded-lg font-sf-pro"
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
        class="font-sf-pro mt-2"
      >
        <Column
          field="firstName"
          header="Name"
          sortable
          headerStyle="font-bold"
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
        <Column field="lastName"></Column>
        <Column :field="'isCurrentUser'" class="w-full">
          <template #body="slotProps">
            <div v-if="isCurrentUser(slotProps.data)" class="py-1">(You)</div>
          </template>
        </Column>
        <Column
          header="Change Role"
          headerClass="align-middle text-center justify-center "
          :exportable="false"
          class="w-full align-middle justify-center"
        >
          <template #body="slotProps">
            <div class="w-[500px]">
              <Button
                label="Instructor"
                v-if="!isCurrentUser(slotProps.data)"
                icon="pi pi-arrow-right-arrow-left"
                class="w-fit h-9 rounded-md bg-[#00AEA4]"
                @click="del(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style>
.rectangle4 {
  padding-bottom: 2rem;
}

.rectangle3 {
  padding-bottom: 0.5rem;
  margin-top: 10px;
  height: 100%;
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

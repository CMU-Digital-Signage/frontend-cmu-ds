<!-- <script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InstructorCompo",
});
</script>
<script setup lang="ts">
import { ref, computed } from "vue";
import { addAdmin } from "@/services";
import store from "@/store";

const instructor = computed(() =>
  store.state.allUser.filter(
    (e) =>
      !e.isAdmin &&
      (e.firstName.toLowerCase().includes(search.value?.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.value?.toLowerCase()))
  )
);
const search = ref("");

const add = async (id: string) => {
  const newAdmin = await addAdmin({ id });
  if (newAdmin.ok) {
    store.commit("setAdmin", { id, isAdmin: true });
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
  <div class="rectangle4 flex-1">
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
        :value="instructor"
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
          <template #sorticon="slotProps">
            <i
              class="m-3 pi"
              :class="{
                'pi-sort-alt': slotProps.sortOrder === 0,
                'pi-sort-alpha-down': slotProps.sortOrder === 1,
                'pi-sort-alpha-up': slotProps.sortOrder === -1,
              }"
            >
            </i>
          </template>
        </Column>
        <Column field="lastName" class="w-1/12"></Column>
        <Column class="w-auto">
          <template #body="rowData">
            <div v-if="!rowData"></div>
          </template>
        </Column>
        <Column header="Change Role" class="w-1/2" :exportable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-arrow-right-arrow-left"
              label="Admin"
              class="w-fit h-9 rounded-md bg-[#0094FF]"
              @click="add(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
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
</style> -->

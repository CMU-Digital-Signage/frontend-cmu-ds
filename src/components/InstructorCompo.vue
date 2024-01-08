<script lang="ts">
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
const message = ref();
const search = ref("");

const add = async (id: number) => {
  const newAdmin = await addAdmin({ id });
  if (newAdmin.ok) {
    store.commit("setAdmin", { id, isAdmin: true });
  } else {
    message.value = newAdmin.message;
  }
};
</script>

<template>
  <div class="rectangle4 flex-1 font-sf-pro">
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
        :value="instructor"
        scrollDirection="vertical"
        scrollable
        scrollHeight="calc(100vh - 235px)"
        class="font-sf-pro mt-2"
      >
        <Column
          field="firstName"
          header="Name"
          sortable
          class="max-w-fit"
          headerStyle=" font-bold"
        ></Column>
        <Column field="lastName" style=""></Column>
        <Column :exportable="false" class="w-full text-center">
          <template #body="slotProps">
            <Button
              icon="pi pi-arrow-right-arrow-left"
              label="Admin"
              class="w-fit h-9 rounded-md"
              severity="info"
              @click="add(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style>
.rectangle4 {
  background-color: #904b4b00; /* Adjust the background color as needed */
  padding-bottom: 2rem;
}

.rectangle3 {
  background-color: #e0caca00; /* Adjust the background color as needed */
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

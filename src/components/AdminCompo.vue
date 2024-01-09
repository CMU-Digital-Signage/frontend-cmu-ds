<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AdminCompo",
});
</script>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { addAdmin, deleteAdmin } from "@/services";
import { User } from "@/types";
import store from "@/store";

const form = reactive({
  firstName: null,
  lastName: null,
});
const user = ref<User>(store.state.userInfo);
const admin = computed(() => store.state.allUser.filter((e) => e.isAdmin));
const message = ref();

const add = async () => {
  if (form.firstName && form.lastName) {
    const newAdmin = await addAdmin({
      firstName: form.firstName,
      lastName: form.lastName,
    });
    if (newAdmin.ok) {
      store.state.allUser.push(newAdmin.admin);
    } else {
      message.value = newAdmin.message;
    }
  }
};

const isCurrentUser = (admin: User) => {
  return admin.id === user.value.id;
};

const del = async (id: number) => {
  const res = await deleteAdmin(id);
  if (res.ok) {
    store.commit("setAdmin", { id, isAdmin: false });
  } else {
    message.value = res.message;
  }
};

const calculateScreenHeight = () => {
  const screenHeight = window.innerHeight;
  const multiplier = 0.71;
  const scrollHeight = screenHeight * multiplier;
  return `${scrollHeight}px`;
}

</script>

<template>
  <div ref="containerRef" class="rectangle4 flex-1 font-sf-pro">
    <form @submit.prevent="add" class="flex flex-row gap-2">
      <label for="macAddress" class="text-primary-50 font-semibold pt-2"
        >Fullname:
      </label>
      <InputText
        id="email"
        class="border border-[#C6C6C6] p-2 h-9 ml-2 w-72 mt-1 rounded-lg font-sf-pro"
        placeholder="Ex.Prayut Chan-O-Cha"
        type="text"
        v-model="form.firstName"
      ></InputText>
      <Button
        label="Add"
        type="submit"
        class="flex ml-4 items-center justify-center px-5 rounded-xl py-1 mt-1 text-white font-semibold custom-button"
      ></Button>
    </form>
    <div class="rectangle3">
      <DataTable
        :value="admin"
        scrollDirection="vertical"
        scrollable
        :scrollHeight=calculateScreenHeight()
        class="font-sf-pro mt-2"
      >
        <Column
          field="firstName"
          header="Name"
          sortable
          class="max-w-fit font-semibold"
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
        <Column field="lastName" class="font-semibold"></Column>
        <Column :field="'isCurrentUser'">
          <template #body="slotProps">
            <div v-if="isCurrentUser(slotProps.data)" class="py-1">(You)</div>
          </template>
        </Column>
        <Column :exportable="false" class="w-full text-center">
          <template #body="slotProps">
            <Button
              label="Instructor"
              v-if="!isCurrentUser(slotProps.data)"
              icon="pi pi-arrow-right-arrow-left"
              class="w-fit h-9 rounded-md bg-[#00AEA4]"
              @click="del(slotProps.data.id)"
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

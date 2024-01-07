<template>
  <div class="rectangle4 flex-1 font-sf-pro">
    <form @submit.prevent="add" class="flex flex-row gap-2">
      <label for="macAddress" class="text-primary-50 font-semibold pt-2"
        >Email:
      </label>
      <InputText
        id="email"
        class="border border-[#C6C6C6] p-2 h-9 ml-2 w-72 mt-1 rounded-lg font-sf-pro"
        placeholder="@cmu.ac.th only (CPE Staff)"
        type="text"
        v-model="email"
      ></InputText>
      <Button
        label="Add"
        type="submit"
        class="flex ml-4 items-center justify-center px-5 rounded-xl py-1 bg-[#1878F7] text-white font-semibold custom-button"
      ></Button>
    </form>
    <div class="rectangle3">
      <DataTable
        :value="admin"
        scrollDirection="vertical"
        scrollable
        scrollHeight="calc(100vh - 225px)"
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
              class="w-fit h-9 rounded-md"
              severity="info"
              @click="del(slotProps.data.email)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import store from "@/store";
import router from "@/router";
import { getAdmin, addAdmin, deleteAdmin } from "@/services";
import { User } from "@/types";
import { useStore } from "vuex";

export default defineComponent({
  name: "AdminCompo",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async add() {
      const newAdmin = await addAdmin(this.email);
      if (newAdmin.ok) {
        this.admin.push(newAdmin.admin);
        this.email = "";
      } else {
        this.message = newAdmin.message;
      }
    },
    calculateScrollHeight() {
      const containerHeight = this.$el.clientHeight;
      return `${containerHeight * 0.8}px`;
    },
  },
  setup() {
    const store = useStore();
    const user = ref<User>(store.state.userInfo);
    const admin = ref<User[]>([]);
    const message = ref();

    const fetchData = async () => {
      const res = await getAdmin();
      if (res.ok) {
        admin.value = res.admin.filter((e: User) => e.isAdmin) as User[];
      }
    };

    onMounted(() => {
      fetchData();
    });

    const isCurrentUser = (admin: User) => {
      return admin.id === user.value.id;
    };

    const del = async (email: string) => {
      // const newAdmin = await deleteAdmin(email);
      // if (newAdmin.ok) {
      //   admin.value = admin.value.filter((e) => e.email !== email);
      // } else {
      //   message.value = newAdmin.message;
      // }
    };

    return { message, admin, user, isCurrentUser, del };
  },
});
</script>

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
    background-color: #1369DA;
  }
</style>

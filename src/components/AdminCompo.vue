<template>
  <div class="rectangle4">
    <div class="flex flex-row gap-2">
      <label for="macAddress" class="text-primary-50 font-medium pt-1.5"
        >Email:
      </label>
      <InputText
        id="email"
        class="border border-[#C6C6C6] p-2 h-9 ml-2 w-48 rounded-xl"
        placeholder="domain @cmu.ac.th only"
      ></InputText>
      <Button
        label="Add"
        class="flex ml-4 items-center justify-center px-5 border-1 border-white-alpha-30 rounded-xl py-1.5 bg-[#36BFA7] text-white font-semibold"
      ></Button>
    </div>
    <ul class="flex gap-44 pt-4 text-[16px] text-[#575757]">
      <li class="pl-2">Name</li>
    </ul>
    <div class="border-t-[2px] w-12/12 border-[#575757]"></div>
    <div class="rectangle3">
      <div v-for="(e, i) in admin" :key="i">
        <ul class="box-admin flex items-center">
          <div class="circle text-white text-xl">
            <div>{{ (e.firstName || "").charAt(0) }}</div>
          </div>
          <div class="pl-5">
            <p v-if="isCurrentUser(e)">
              {{ e.firstName }} {{ e.lastName }} (You)
            </p>
            <p v-else>{{ e.firstName }} {{ e.lastName }}</p>
          </div>
          <Button
            v-if="!isCurrentUser(e)"
            label="Delete"
            text
            class="border-1 border-white-alpha-30 text-[#FF0000] underline rounded-lg py-2 ml-auto"
          ></Button>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import store from "@/store";
import router from "@/router";
import { getAdmin, addAdmin } from "@/services";
import { Admin, User } from "@/types";
import { useStore } from "vuex";

export default defineComponent({
  name: "AdminCompo",
  setup() {
    const store = useStore();
    const user = ref<User>(store.state.userInfo);
    const admin = ref<Admin[]>([]);

    const fetchData = async () => {
      const res = await getAdmin();
      if (res.ok) {
        admin.value = res.admin as Admin[];
        admin.value.sort((a, b) => {
          if (isCurrentUser(a)) return -1;
          if (isCurrentUser(b)) return 1;
          return 0;
        });
      }
    };

    onMounted(() => {
      fetchData();
    });
    
    const isCurrentUser = (admin: Admin) => {
      return admin.id === user.value.id;
    };
    return { admin, user, isCurrentUser };
  },
});
</script>

<style>
.rectangle4 {
  background-color: #904b4b00; /* Adjust the background color as needed */
  padding-bottom: 2rem;
  padding-left: 1.5rem;
}

.rectangle3 {
  background-color: #e0caca00; /* Adjust the background color as needed */
  padding-bottom: 0.5rem;
  overflow-y: scroll;
  margin-top: 10px;
}

.box-admin {
  display: flex;
  background-color: rgba(
    157,
    199,
    80,
    0
  ); /* Adjust the background color as needed */
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
</style>

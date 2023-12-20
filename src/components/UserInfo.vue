<template>
  <div v-if="user">{{ user.firstName }} {{ user.lastName }}</div>
  <div v-else>Loading...</div>
  <button @click="logout()">Log out</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import { signOut } from "@/services";
import router from "@/router";

export default defineComponent({
  name: "UserInfo",
  computed: {
    user() {
      return store.state.userInfo;
    },
  },
  methods: {
    logout() {
      signOut().finally(() => {
        store.commit("setUserInfo", null);
        router.replace("/login");
      });
    },
  },
});
</script>

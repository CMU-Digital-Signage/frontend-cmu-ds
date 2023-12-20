<template>
  <div v-if="user">{{ user.firstName }} {{ user.lastName }}</div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import store from "@/store";
import { getUserInfo } from "@/services";
import router from "@/router";

export default defineComponent({
  name: "UserInfo",
  computed: {
    user() {
      return store.state.userInfo;
    },
  },
  setup() {
    onMounted(async () => {
      const res = await getUserInfo();
      if (res.ok) {
        store.commit("setUserInfo", res.user);
      } else {
        router.replace("/");
      }
    });
  },
});
</script>

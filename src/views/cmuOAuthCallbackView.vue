<template>
  <div class="py-32 justify-center flex flex-row gap-10">
    <button class="bg-rose" @click="$router.push('/login')">Back</button>
    <button class="bg-teal" @click="$router.push('/')">Dashboard</button>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import router from "@/router";

export default {
  setup() {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get("code");

    const store = useStore();
    const message = ref("");

    async function signIn(authorizationCode: string) {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/cmuOAuth`,
          {},
          {
            params: {
              code: authorizationCode,
            },
            withCredentials: true,
          }
        );
        return res.data;
      } catch (err: any) {
        if (!err.response) {
          message.value =
            "Cannot connect to API Server. Please try again later.";
        } else if (!err.response.data.ok) {
          message.value = err.response.data.message;
        } else {
          message.value = "Unknown error occurred. Please try again later.";
        }
      }
    }

    const setUserInfo = (data: any) => {
      store.commit("setUserInfo", data);
    };

    const fetchData = async () => {
      if (!code) return;

      const res = await signIn(code);
      if (res) {
        setUserInfo(res);
        router.replace("/");
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      message,
      userInfo: store.state.userInfo,
    };
  },
};
</script>

<style></style>

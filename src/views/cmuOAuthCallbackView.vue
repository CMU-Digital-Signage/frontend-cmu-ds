<template>
  <div class="py-32 flex flex-col gap-10">
    <h1 class="text-3xl">{{ message }}</h1>
    <div class="justify-center flex flex-row gap-10 text-xl">
      <button class="bg-[#ED3838]" @click="$router.push('/login')">Back</button>
    </div>
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
    const message = ref("Loading...");

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

    const fetchData = async () => {
      if (!code) return;

      const res = await signIn(code);
      if (res) {
        store.state.userInfo = res.user;
        localStorage.setItem("token", res.token);
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

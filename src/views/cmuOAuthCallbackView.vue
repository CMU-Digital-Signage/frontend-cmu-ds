<template>
  <div class="flex  h-full  justify-center items-center flex-col ">
    <img
              class=" w-[500px] mb-10 "
              alt="cmulogo"
              src="../assets/images/403.png"
            />
            <p class=" text-[36px] text-teal-500 font-semibold mb-4">Access Denied</p>
            <p class=" text-[18px] text-[#575757] font-normal">Look like your CMU account don't have permission to access this page.  </p>
            <p class=" text-[18px] text-[#575757] font-normal mb-14 mt-[2px]">Reach out to system adminstrator to gain access </p>
    <div class="justify-center flex flex-row items-center text-xl">
   
      <Button
        class=" text-cyan-600 bg-none border-none font-normal  text-xl hover:underline "
        link
        @click="$router.push('/login')"
        >Back to login</Button
      >
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
            `Cannot connect to API Server.\nPlease try again later.`;
        } else if (!err.response.data.ok) {
          message.value = err.response.data.message;
        } else {
          message.value = "Unknown error occurred. Please try again later.";
        }
      }
    }

    const fetchData = async () => {
      if (!code) {
        message.value = queryParameters.get("error") || "";
        return;
      }

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

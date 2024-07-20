<template>
  <div v-if="status != 0" class="flex h-full justify-center items-center flex-col">
    <div v-if="[403, 401].includes(status)">
      <img
        class="w-[500px] mb-10"
        alt="cmulogo"
        src="../assets/images/403.png"
      />
      <p class="text-[36px] text-teal-500 font-semibold mb-4">Access Denied</p>
      <p class="text-[18px] text-[#575757] font-normal">
        Look like your CMU account don't have permission to access this page.
      </p>
      <p class="text-[18px] text-[#575757] font-normal mb-14 mt-[2px]">
        Reach out to system adminstrator to gain access
      </p>
    </div>
    <div v-else-if="[400].includes(status)">
      <img
        class="w-[500px] mb-10"
        alt="cmulogo"
        src="../assets/images/403.png"
      />
      <p class="text-[36px] text-teal-500 font-semibold mb-4">Bad Request</p>
      <p class="text-[18px] text-[#575757] font-normal">
        Look like your CMU account don't have permission to access this page.
      </p>
      <p class="text-[18px] text-[#575757] font-normal mb-14 mt-[2px]">
        Reach out to system adminstrator to gain access
      </p>
    </div>
    <div v-else-if="[500].includes(status)">
      <img
        class="w-[500px] mb-10"
        alt="cmulogo"
        src="../assets/images/403.png"
      />
      <p class="text-[36px] text-teal-500 font-semibold mb-4">Internal server error</p>
      <p class="text-[18px] text-[#575757] font-normal">
        Look like your CMU account don't have permission to access this page.
      </p>
      <p class="text-[18px] text-[#575757] font-normal mb-14 mt-[2px]">
        Reach out to system adminstrator to gain access
      </p>
    </div>
    <div v-else-if="[401].includes(status)">
      <img
        class="w-[500px] mb-10"
        alt="cmulogo"
        src="../assets/images/403.png"
      />
      <p class="text-[36px] text-teal-500 font-semibold mb-4">Unauthorized</p>
      <p class="text-[18px] text-[#575757] font-normal">
        Look like your CMU account don't have permission to access this page.
      </p>
      <p class="text-[18px] text-[#575757] font-normal mb-14 mt-[2px]">
        Reach out to system adminstrator to gain access
      </p>
    </div>

    <Button
      class="text-cyan-600 bg-none border-none font-normal text-xl hover:underline"
      link
      @click="$router.push('/login')"
      >Back to login</Button
    >
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

    const status = ref(0);

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
        status.value = res.status;
        return res.data;
      } catch (err: any) {
        if (!err.response) {
          status.value = 500;
          message.value = `Cannot connect to API Server.\nPlease try again later.`;
        } else if (!err.response.data.ok) {
          status.value = err.response.status;
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
      status,
    };
  },
};
</script>

<style></style>

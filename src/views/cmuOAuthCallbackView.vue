<template>
  <div
    v-if="status != 0"
    class="flex h-full w-full bg-[#f1f9ff] justify-center items-center"
  >
    <div
      v-if="[403].includes(status)"
      class="flex h-full w-full items-center px-[160px]"
    >
      <div class="flex flex-col items-start">
        <p class="text-[44px] text-blue-700 font-light mb-10">Hold on...</p>
        <p class="text-[32px] text-blue-700 font-normal">Error 403</p>
        <p class="text-[48px] text-blue-700 font-normal -mt-2 mb-8">
          ACCESS DENIED
        </p>
        <p class="text-[18px] text-[#575757] font-normal">
          Look like your CMU account don't have permission to access this page.
        </p>
        <p class="text-[18px] text-[#575757] font-normal mb-14">
          Reach out to system administrator to gain access.
        </p>

        <Button
          class="text-cyan-600 -translate-x-4 border-none font-normal text-xl hover:underline"
          link
          @click="$router.push('/login')"
          >Back to login</Button
        >
      </div>
    </div>
    <div
      v-else-if="[400].includes(status)"
      class="flex h-full w-full items-center px-[160px]"
    >
      <div class="flex flex-col items-start">
        <p class="text-[44px] text-blue-700 font-light mb-10">Whoops!</p>
        <p class="text-[32px] text-blue-700 font-normal">Error 400</p>
        <p class="text-[48px] text-blue-700 font-normal -mt-2 mb-8">
          BAD REQUEST
        </p>
        <p class="text-[18px] text-[#575757] font-normal mb-14">
          Something went wrong. We encountered an issue processing your request.
        </p>

        <Button
          class="text-cyan-600 -translate-x-4 border-none font-normal text-xl hover:underline"
          link
          @click="$router.push('/login')"
          >Back to login</Button
        >
      </div>
    </div>

    <div
      v-else-if="[500].includes(status)"
      class="flex h-full w-full items-center px-[160px]"
    >
      <div class="flex flex-col items-start">
        <p class="text-[44px] text-blue-700 font-light mb-10">
          Sorry, this is unexpected...
        </p>
        <p class="text-[32px] text-blue-700 font-normal">Error 500</p>
        <p class="text-[48px] text-blue-700 font-normal -mt-2 mb-8">
          <span
            class="bg-gradient-to-r text-transparent bg-clip-text from-blue-500 via-green-500 to-indigo-400"
            >pixelParade</span
          >
          LOST
        </p>
        <p class="text-[18px] text-[#575757] font-normal">
          We are facing an internal server error. Our team are trying to fix the
          problem.
        </p>
        <p class="text-[18px] text-[#575757] font-normal mb-14">
          Please be patient or try again by hit Command/Ctrl + R.
        </p>

        <!-- <Button
          class="text-cyan-600 -translate-x-4 border-none font-normal text-xl hover:underline"
          link
          @click="$router.push('/login')"
          >Back to login</Button
        > -->
      </div>
    </div>
    <div
      v-else-if="[401].includes(status)"
      class="flex h-full w-full items-center px-[160px]"
    >
      <div class="flex flex-col items-start">
        <p class="text-[44px] text-blue-700 font-light mb-10">Oh No!</p>
        <p class="text-[32px] text-blue-700 font-normal">Error 401</p>
        <p class="text-[48px] text-blue-700 font-normal -mt-2 mb-8">
          UNAUTHORIZED
        </p>
        <p class="text-[18px] text-[#575757] font-normal">
          We couldn't validate or support your credentials.
        </p>
        <p class="text-[18px] text-[#575757] font-normal mb-14">
          Please try again.
        </p>
        <Button
          class="text-cyan-600 -translate-x-4 border-none font-normal text-xl hover:underline"
          link
          @click="$router.push('/login')"
          >Back to login</Button
        >
      </div>
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

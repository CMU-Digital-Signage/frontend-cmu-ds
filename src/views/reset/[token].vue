<script lang="ts">
export default {
  name: "SetNewPasswordView",
};
</script>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { setPassword } from "@/services/user";
import { checkTokenExpired } from "@/utils/constant";
import router from "@/router";

const message = ref("");
const route = useRoute();
const token = route.params.token as string;
const password = ref("");
const cfPassword = ref("");

const toast = useToast();

watchEffect(() => {
  message.value = checkTokenExpired(token);
});

const resetPassword = async () => {
  if (!password.value.length || !cfPassword.value.length) {
    toast.add({
      severity: "error",
      summary: "Empty Password or Confirm Password",
      life: 3000,
    });
  } else if (password.value === cfPassword.value) {
    const res = await setPassword(password.value);
    if (res.ok) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Reset Emergency Password successfully.",
        life: 1000,
      });
    }
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  } else {
    toast.add({
      severity: "error",
      summary: "Not Match",
      life: 3000,
    });
  }
};
</script>

<template>
  <div
    class="bg-gradient-to-r from-[#E5F9FA] to-[#F6FDF7] h-screen flex items-center justify-center overflow-hidden"
  >
    <Toast />
    <h1 class="text-xl" v-if="!message.includes('Success')">{{ message }}</h1>
    <div
      v-else
      class="w-full rounded-none md:w-2/3 h-full relative md:h-3/4 md:bg-gradient-to-r md:from-[#F8FEFE] md:to-[#f3fcfa] border-2 border-[#B8F1F0] drop-shadow-xl md:rounded-[15px] flex flex-col items-center text-center"
    >
      <img
        class="absolute md:mt-6 md:ml-6 w-24 h-7 mt-4 ml-4 top-0 left-0 md:w-36 md:h-11 lg:mt-8 lg:ml-20"
        alt="cpelogo"
        src="../../assets/images/cpe-logo.png"
      />

      <div
        class="absolute top-48 h-fit lg:top-40 sm:left-0 w-[500px] lg:px-14 md:px-10 md:h-1/2 md:ml-20 rounded-[15px] flex flex-col md:items-center md:justify-center md:text-center"
      >
        <p
          class="font-sf-pro-rounded mt-48 text-2xl lg:mt-12 md:text-4xl font-medium text-[#000000]"
        >
          CPE Digital Signage
        </p>
        <span
          class="font-sf-pro-rounded text-xl lg:mt-4 md:text-xl lg:mb-6 font-medium text-[#000000]"
          >Reset Your Emergency Password</span
        >
        <div class="flex flex-col gap-2 w-full">
          <Password
            id="Password"
            v-model="password"
            placeholder="New Password"
            input-class="w-screen rounded-[12px] border-2"
            class="w-full mb-2"
            :feedback="false"
            toggle-mask
          />

          <Password
            id="confirmPassword"
            input-class="w-screen rounded-[12px] border-2"
            class="w-full"
            v-model="cfPassword"
            placeholder="Re-type New Password"
            :feedback="false"
            toggle-mask
          />
        </div>

        <Button
          @click="
            () => {
              resetPassword();
            }
          "
          class="w-full md:p-5 items-center justify-center mt-5 md:h-11 h-fit p-2 bg-[#039ae5] border-0 relative rounded-[10px] text-sm md:text-lg"
        >
          <p class="font-sf-pro-rounded ml-2 font-medium">Reset Password</p>
        </Button>
      </div>
      <img
        class="absolute top-28 lg:right-0 w-72 md:w-80 lg:w-1/2"
        alt="picLogin"
        src="../../assets/images/picLogin.png"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { getDeviceMac, getDevicePoster } from "@/services";
import router from "@/router";
import store from "@/store";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "MacView",
  setup() {
    const route = useRoute();
    const image = ref("");
    const message = ref();
    const fetchData = async () => {
      const res = await getDeviceMac(route.params.mac as string);
      if (res.ok) {
        image.value = res.image;
        console.log(image.value);
      } else {
        message.value = res.message;
      }
    };

    onMounted(() => {
      fetchData();
    });
    return {
      image,
      message,
    };
  },
};
</script>

<template>
  <!-- <div>{{ this.$route.params.mac }}</div> -->
  <div v-if="message">{{ message }}</div>
  <div class="w-screen h-screen bg-black">
    <img class="max-w-full max-h-full m-auto" alt="poster" :src="image" />
  </div>
</template>

<style></style>

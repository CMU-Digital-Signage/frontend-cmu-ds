<script setup lang="ts">
import { getPosterEachDevice } from "@/services";
import router from "@/router";
import store from "@/store";
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const poster = computed(() => store.state.posters);
const image = ref<any>([]);
const message = ref();
const fetchData = async () => {
  const res = await getPosterEachDevice(route.params.mac as string);
  if (res.ok) {
    image.value = res.image;
  } else {
    message.value = res.message;
  }
  console.log(image.value);
};

watchEffect(() => {
  fetchData();
});
</script>
<script lang="ts">
export default {
  name: "MacView",
};
</script>

<template>
  <div v-if="message">{{ message }}</div>
  <div class="w-screen h-screen bg-black">
    <img
      class="max-w-full max-h-full m-auto"
      alt="poster"
      :src="image[0]?.image"
    />
  </div>
</template>

<style></style>

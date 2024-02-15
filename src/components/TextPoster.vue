<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TextPoster",
});
</script>

<script setup lang="ts">
import { defineProps, toRefs, onUpdated } from "vue";

const props = defineProps({ text: String });

const { text } = toRefs(props);
onUpdated(() => {
  console.log(text);
});
</script>

<template>
  <div class="bg-black-500 w-[100px] h-[100px]">
    <p>sssssssssssssss</p>
  </div>
</template>

<style></style>

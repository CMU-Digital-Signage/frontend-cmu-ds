<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PopupUpload",
});
</script>
<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import store from "@/store";

const props = defineProps<{ show: boolean }>();
const { show } = toRefs(props);
</script>

<template>
  <Dialog v-model:visible="show" modal close-on-escape :draggable="false">
  </Dialog>
</template>

<style></style>

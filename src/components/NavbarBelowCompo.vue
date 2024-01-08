<script lang="ts">
export default defineComponent({
  name: "NavBarBottom",
});
</script>
<script setup lang="ts">
import { defineComponent } from "vue";
</script>

<template>
  <div
    class="bg-[#F6F6F6] border-t border-[#c7bbbb] h-14 px-6 flex items-center font-sf-pro"
  >
    <ul
      v-if="$route.path === '/uploadfile'"
      class="flex items-center justify-end w-full"
    >
      <Button
        class="bg-teal border-teal font-semibold font-sf-pro text-white w-24 h-10 rounded-lg flex items-center justify-center"
        >Upload</Button
      >
    </ul>
  </div>
</template>

<style></style>

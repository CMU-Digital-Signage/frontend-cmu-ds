<script setup lang="ts">
import PreviewComponent from "@/components/PreviewComponent.vue";
</script>

<template>
  <div class="rectangle">
    <PreviewComponent />
  </div>
</template>

<style>
.rectangle {
  flex: 1 1;
  padding-inline: 1.5rem;
  margin-bottom: 3.5rem;
  overflow-y: auto;
}
</style>

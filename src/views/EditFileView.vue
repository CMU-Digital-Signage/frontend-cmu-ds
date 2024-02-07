<script setup lang="ts">
import { onUpdated, ref, watch } from "vue";
import UpNorFileCompo from "@/components/UpNorFileCompo.vue";
import UpEmerFileCompo from "@/components/UpEmerFileCompo.vue";
import store from "@/store";

const click = ref(0);
onUpdated(() => {
  store.commit("resetForm");
});
</script>

<template>
  <div class="rectangle8 flex-1">
    <UpNorFileCompo v-if="store.state.formDisplay[0].duration" />
    <UpEmerFileCompo v-else />
  </div>
</template>

<style>
.rectangle8 {
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TextPoster",
});
</script>

<script setup lang="ts">
import { defineProps, toRefs, onUpdated, computed } from "vue";
import store from "@/store";

const props = defineProps({ text: String });
</script>

<template>
  <div class=" w-full h-full bg-[#ff0000] flex flex-col gap-1">
    <div class="flex flex-col items-center justify-center gap-16 py-8">
      <div class=" w-28 h-28 flex items-center justify-center rounded-full">
        <i class="pi pi-exclamation-triangle text-white text-7xl"></i>
      </div>
      <p
        class="font-sf-pro-rounded text-white -mt-[12px] text-[60px] font-bold tracking-wider"
      >
        Emergency !
      </p>
     
    </div>
    <div
      class="font-notoThai text-white text-xl tracking-wide flex flex-col gap-1"
    >
      <p class="text-[60px] mb-44">ฉุกเฉิน !</p>
      <div class="flex justify-center">
        <p class="whitespace-pre-line text-[40px] text-center text-white">
          {{ props.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style></style>

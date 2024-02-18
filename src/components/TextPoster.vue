<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TextPoster",
});
</script>

<script setup lang="ts">
import { defineProps, toRefs, onUpdated } from "vue";

const props = defineProps({ text: String });

// const processText = (text: any) => {
//   if (!text) {
//     return "";
//   }

//   let processedText = "";
//   let charCount = 0;
//   for (let i = 0; i < text.length; i++) {
//     if (text[i] === "\n" || text[i] === " ") {
//       processedText += text[i];
//       charCount = 0;
//     } else {
//       processedText += text[i];
//       charCount++;
//     }
//     if (charCount === 6) {
//       processedText += "\n";
//       charCount = 0;
//     }
//   }

//   return processedText;
// };
</script>

<template>
  <div class="w-96 h-[550px] bg-[#FF5252] flex flex-col gap-1">
    <div class="flex flex-col items-center justify-center gap-16 py-8">
      <p
        class="font-sf-pro-rounded text-white text-5xl font-bold tracking-wider"
      >
        Emergency
      </p>
      <div class="w-8 h-8 flex items-center justify-center rounded-full">
        <i class="pi pi-exclamation-triangle text-white text-7xl"></i>
      </div>
    </div>
    <div
      class="font-notoThai text-white text-xl tracking-wide flex flex-col gap-1"
    >
      <p class="text-2xl mb-10">ฉุกเฉิน!</p>
      <div class="flex justify-center">
        <p class="whitespace-pre-line text-center text-white">
          {{ props.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style></style>

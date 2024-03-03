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

const processText = (text: any) => {
  if (!text) {
    return "";
  }

  let processedText = "";
  let charCount = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      processedText += text[i];
      charCount = 0;
    } else {
      processedText += text[i];
      charCount++;
    }
    if (charCount === 34) {
      processedText += "\n";
      charCount = 0;
    }
  }

  return processedText;
};
</script>

<template>
  <div
    class="bg-[#FF0000] flex flex-col gap-1"
    :class="
      $route.path === '/emergency'
        ? 'w-[500px] h-[900px]'
        : 'w-full h-[1300px] -mt-[20px]'
    "
  >
    <div :class="$route.path === '/emergency' ? 'mt-[120px]' : '-my-5'">
      <div
        class="flex flex-col items-center justify-center"
        :class="$route.path === '/emergency' ? 'gap-1' : 'gap-16'"
      >
        <div class="w-28 h-28 flex items-center justify-center rounded-full">
          <i
            class="pi pi-exclamation-triangle text-white"
            :class="$route.path === '/emergency' ? 'text-7xl' : 'text-[160px]'"
          ></i>
        </div>
        <p
          class="font-sf-pro-rounded text-white font-bold tracking-wider mb-5"
          :class="$route.path === '/emergency' ? 'text-5xl' : 'text-7xl'"
        >
          Emergency !
        </p>
      </div>
      <div
        class="font-notoThai text-white text-xl tracking-wide flex flex-col gap-1"
      >
        <p
          :class="
            $route.path === '/emergency'
              ? 'text-4xl mb-5 -mt-2'
              : 'text-7xl mb-10'
          "
        >
          ฉุกเฉิน !
        </p>
        <div class="flex justify-center">
          <p
            class="whitespace-pre-line text-center text-white"
            :class="
              $route.path === '/emergency'
                ? 'text-[30px] leading-[42px]'
                : 'text-5xl leading-[70px]'
            "
          >
            {{ processText(props.text) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

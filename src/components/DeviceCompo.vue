<template>
    
    <div class="rectangle5">
        <ul class="flex gap-44 pt-12 text-[16px] text-[#575757]">
      <li class="pl-2"
      >
        Device Name
      </li>
      <li
      >
        Room
      </li>
    </ul>
        <div class="border-t-[2px] w-12/12 border-[#575757] "></div>
    </div>
</template>


<script lang="ts">
import { ref, defineComponent } from "vue";
import store from "@/store";
import router from "@/router";
import { getUserInfo, signOut } from "@/services";

export default defineComponent({
 
  
});
</script>

<style>
.rectangle5 {
  background-color: #b2c19600; /* Adjust the background color as needed */
  height: calc(100vh - 6.5rem);
  padding-bottom: 2rem;
  padding-left: 1.5rem;
}
</style>
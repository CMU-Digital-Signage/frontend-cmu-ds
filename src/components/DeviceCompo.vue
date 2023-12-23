<template>
    
    <div class="rectangle5">
        <ul class="flex gap-36 pt-12 text-[16px] text-[#575757]">
      <li
      >
        Device Name
      </li>
      <li
      >
        Room
      </li>
    </ul>
        <div class="border-t-[1px] w-12/12 border-[#575757] mt-[-1px] "></div>
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
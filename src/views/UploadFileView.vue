<script setup lang="ts">
import UpNorFileCompo from "@/components/UpNorFileCompo.vue";

</script>

<template>
  <div class="rectangle8 flex-1 font-sf-pro ">
    <TabView class="rectangle flex flex-col font-sf-pro overflow-y-auto ">
      <TabPanel header="Normal File">
        <UpNorFileCompo />
      </TabPanel>
      <TabPanel class="text-[#f00]" header="Emergency File"> </TabPanel>
    </TabView>
  </div>
</template>

<style>
.rectangle8 {
  background-color: #83434300; /* Adjust the background color as needed */
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

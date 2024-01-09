<script setup lang="ts">
import UpNorFileCompo from "@/components/UpNorFileCompo.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { ref } from "vue";

const click = ref(0);
</script>

<template>
  <div class="rectangle8 flex-1 font-sf-pro">
    <TabView
      v-model:active-index="click"
      class="rectangle flex flex-col font-sf-pro overflow-y-auto"
    >
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

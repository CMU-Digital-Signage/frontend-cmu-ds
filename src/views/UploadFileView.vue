<template>
  <div class="rectangle8 flex-1 font-sf-pro">
    <TabView class="rectangle flex flex-col">
      <TabPanel header="Normal File">
        <UploadNormal />
      </TabPanel>
      <TabPanel class="text-[#f00]" header="Emergency File">
        <!-- <Device /> -->
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UploadNormal from "@/components/UpNorFileCompo.vue";

export default defineComponent({
  name: "UploadView",
  components: { UploadNormal },
});
</script>

<style>
.rectangle8 {
  background-color: #83434395; /* Adjust the background color as needed */
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

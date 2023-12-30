<template>
    <div class="px-5 pt-2">
      <TabView class="rectangle flex flex-col">
        <TabPanel header="Normal File">
          <UploadNormal  />
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

</style>
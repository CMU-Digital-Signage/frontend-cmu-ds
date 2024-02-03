<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import FileTable from "@/components/FileTableCompo.vue";
import { onUpdated, ref, watch } from "vue";
import store from "../store";

const click = ref(0);

onUpdated(() => {
  store.commit("resetForm");
});
</script>

<template>
  <div>
    <!-- Tabview -->
    <div class="mx-10 mt-3 font-sf-pro">
      <TabView
        v-model:activeIndex="click"
        class="rectangle flex flex-col font-sf-pro overflow-y-auto"
      >
        <TabPanel header="Normal File">
          <FileTable />
        </TabPanel>
        <TabPanel
          v-if="store.state.userInfo.isAdmin"
          header="Emergency File"
          :pt="{
            headerAction: {
              class: `${click != 0 ? 'text-[#f00] border-[#f00]' : ''}`,
            },
          }"
        >
        </TabPanel>
      </TabView>
    </div>
    <!-- File Table-->
  </div>
</template>

<style></style>

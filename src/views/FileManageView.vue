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
    <div >
      <TabView
        v-model:activeIndex="click"
        class="rectangle18 flex flex-col overflow-y-auto"
      >
        <TabPanel header="Normal File">
          <FileTable :types="'nor'" />
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
          <FileTable :types="'emer'" />
        </TabPanel>
      </TabView>
    </div>
    <!-- File Table-->
  </div>
</template>

<style>
.rectangle18 {
  padding-inline: 1.5rem;
  overflow: hidden;
}

</style>

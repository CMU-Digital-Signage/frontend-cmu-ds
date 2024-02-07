<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { onUpdated, ref, watch } from "vue";
import UpNorFileCompo from "@/components/UpNorFileCompo.vue";
import UpEmerFileCompo from "@/components/UpEmerFileCompo.vue";
import store from "@/store";

const click = ref(0);

onUpdated(() => {
  store.commit("resetForm");
});
</script>

<template>
  <div class="rectangle8 flex-1">
    <TabView
      v-model:activeIndex="click"
      class="rectangle flex flex-col overflow-y-auto"
    >
      <TabPanel header="Normal File">
        <UpNorFileCompo />
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
        <UpEmerFileCompo />
      </TabPanel>
    </TabView>
  </div>
</template>

<style>
.rectangle8 {
  padding-inline: 1.5rem;
  overflow: hidden;
}
</style>

<template>
  <TabView v-model:active-index="click" class="rectangle flex flex-col">
    <TabPanel header="Admin">
      <Admin />
    </TabPanel>
    <TabPanel header="Device">
      <Device />
    </TabPanel>
  </TabView>
  <div class="border-t-[1.5px] w-12/12 border-[#C4C4C4] mt-[-1px]"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "@/router";
import store from "@/store";
import Admin from "@/components/AdminCompo.vue";
import Device from "@/components/DeviceCompo.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

export default defineComponent({
  name: "AdminView",
  components: { Admin, Device },
  data() {
    return {
      click: store.state.adminManage,
    };
  },
  updated() {
    store.commit("setAdminManage", this.click);
  },
});
</script>

<style scoped>
/* Add styles for the rectangle */
.rectangle {
  background-color: #b18b8b00; /* Adjust the background color as needed */
  padding-inline: 1.5rem;
  height: 100%;
  overflow: hidden;
}

TabPanel {
  flex: 1;
}

.bold-ho:hover {
  font-weight: 600;
}

.activer-link {
  border-bottom: 4px solid #282828;
  font-weight: 900;
  border-radius: -2-px;
}

.activer-link:hover {
  color: #282828;
  background-color: #f0f0f014; /* Optional: change background color on hover */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional: add box shadow on hover */
}

.gaptt {
  gap: 8px;
}
</style>

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import 'primevue/resources/themes/lara-light-green/theme.css'
    

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .component("Dialog", Dialog)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .mount("#app");

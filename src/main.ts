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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .component("Dialog", Dialog)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("ColumnGroup", ColumnGroup)
  .component("Row", Row)
  .mount("#app");

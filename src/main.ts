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
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import "primevue/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import FileUpload from "primevue/fileupload";
import ToastService from "primevue/toastservice";
import OverlayPanel from "primevue/overlaypanel";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Checkbox from "primevue/checkbox";


library.add(faBell);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Dialog", Dialog)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("ColumnGroup", ColumnGroup)
  .component("Row", Row)
  .component("FileUpload", FileUpload)
  .component("OverlayPanel", OverlayPanel)
  .component("Checkbox", Checkbox)
  .mount("#app");

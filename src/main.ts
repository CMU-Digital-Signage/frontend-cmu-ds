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
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

library.add(faBell);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, {
    pt: {
      column: {
        sorticon: (slotProps: any) => ({
          class: [
            "m-3 pi",
            {
              "pi-sort-alt": slotProps.props.sortOrder === 0,
              "pi-sort-alpha-down": slotProps.props.sortOrder === 1,
              "pi-sort-alpha-up": slotProps.props.sortOrder === -1,
            },
          ],
        }),
      },
    },
  })
  .use(ToastService)
  .component('VueDatePicker', VueDatePicker)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Dialog", Dialog)
  .component("Button", Button)
  .component("Calendar", Calendar)
  .component("InputNumber", InputNumber)
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

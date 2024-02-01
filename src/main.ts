import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import FileUpload from "primevue/fileupload";
import ToastService from "primevue/toastservice";
import OverlayPanel from "primevue/overlaypanel";
import { icon, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

library.add(faBell);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, {
    pt: {
      global: {
        css: `
          .p-tabview-nav-link {
            background-color: #fafafa
          }
          .p-tabview-nav {
            background-color: #fafafa
          }
          .p-tabview-panels {
            background-color: #fafafa
          }
          .p-datatable-wrapper {
            border-color: #c6c6c6;
            border-width: 1px;
          }
          .p-row-odd {
            background-color: #fafafa
          }
        `,
      },
      Toast: {
        container: (slotProps: any) => ({
          class: [
            "rounded-lg w-full border-solid border-0 border-l-[6px] shadow-md backdrop-blur-[100px]",
            {
              "border-blue-100/70 dark:border-blue-500/20":
                slotProps.props.message.severity == "info",
              "border-green-100/70 dark:border-green-500/20":
                slotProps.props.message.severity == "success",
              "border-orange-100/70 dark:border-orange-500/20":
                slotProps.props.message.severity == "warn",
              "border-[#ff5757] dark:border-red-500/20":
                slotProps.props.message.severity == "error",
            },
            {
              "bg-blue-100/70 dark:bg-blue-500/20":
                slotProps.props.message.severity == "info",
              "bg-green-100/70 dark:bg-green-500/20":
                slotProps.props.message.severity == "success",
              "bg-orange-100/70 dark:bg-orange-500/20":
                slotProps.props.message.severity == "warn",
              "bg-[#ffe7e6] dark:bg-red-500/20":
                slotProps.props.message.severity == "error",
            },
            {
              "text-blue-700 dark:text-blue-300":
                slotProps.props.message.severity == "info",
              "text-green-700 dark:text-green-300":
                slotProps.props.message.severity == "success",
              "text-orange-700 dark:text-orange-300":
                slotProps.props.message.severity == "warn",
              "text-[#ff5757] dark:text-red-500/20":
                slotProps.props.message.severity == "error",
            },
          ],
        }),
        content: (slotProps: any) => ({
          class: ["border-none rounded-lg"],
        }),
        icon: (slotProps: any) => ({
          class: [
            {
              "text-blue-700 dark:text-blue-300":
                slotProps.props.message.severity == "info",
              "text-green-700 dark:text-green-300":
                slotProps.props.message.severity == "success",
              "text-orange-700 dark:text-orange-300":
                slotProps.props.message.severity == "warn",
              "text-[#ff5757] dark:text-red-500/20":
                slotProps.props.message.severity == "error",
            },
          ],
        }),
        closeIcon: (slotProps: any) => ({
          class: [
            {
              "text-blue-700 dark:text-blue-300":
                slotProps.props.message.severity == "info",
              "text-green-700 dark:text-green-300":
                slotProps.props.message.severity == "success",
              "text-orange-700 dark:text-orange-300":
                slotProps.props.message.severity == "warn",
              "text-[#ff5757] dark:text-red-500/20":
                slotProps.props.message.severity == "error",
            },
          ],
        }),
      },
      Column: {
        sorticon: (slotProps: any) => ({
          class: [
            "m-3 pi",
            {
              "pi-sort-alt": slotProps.props.sortOrder == 0,
              "pi-sort-alpha-down": slotProps.props.sortOrder == 1,
              "pi-sort-alpha-up": slotProps.props.sortOrder == -1,
            },
          ],
        }),
      },
    },
  })
  .use(ToastService)
  .component("VueDatePicker", VueDatePicker)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Toast", Toast)
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

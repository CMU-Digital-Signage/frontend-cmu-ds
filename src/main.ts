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
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import FloatLabel from "primevue/floatlabel";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import FileUpload from "primevue/fileupload";
import ToastService from "primevue/toastservice";
import OverlayPanel from "primevue/overlaypanel";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import Skeleton from "primevue/skeleton";
import Calendar from "primevue/calendar";
import Steps from "primevue/steps";
import Tag from "primevue/tag";
import TieredMenu from "primevue/tieredmenu";
import Menu from "primevue/menu";
import Password from "primevue/password";
import ProgressSpinner from "primevue/progressspinner";
import "vue3-carousel-3d/dist/index.css"

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, {
    pt: {
      Tag: {
        root: (slotProps: any) => ({
          class: [
            {
              "bg-yellow-400 bg-opacity-30 text-yellow-800": slotProps.props.severity == "poster",
              "bg-fuchsia-400 bg-opacity-30 text-fuchsia-800": slotProps.props.severity == "video",
              "bg-blue-400 bg-opacity-30 text-blue-800": slotProps.props.severity == "webview",
            },
          ],
        }),
      },
      Toast: {
        text: () => ({ class: ["text-[14px]"] }),
        container: (slotProps: any) => ({
          class: [
            "rounded-md h-fit w-96 right-0 absolute items-center pb-2 border-solid border-0 border-l-[4px] shadow-sm",
            {
              "border-blue-600 bg-blue-100 bg-opacity-60 text-blue-600":
                slotProps.props.message.severity == "info",
              "border-green-600 bg-green-100 bg-opacity-60 text-green-600":
                slotProps.props.message.severity == "success",
              "border-orange-600 bg-orange-100 bg-opacity-60 text-orange-600":
                slotProps.props.message.severity == "warn",
              "border-red-600 bg-red-100 bg-opacity-60 text-red-600":
                slotProps.props.message.severity == "error",
            },
          ],
        }),
        content: (slotProps: any) => ({
          class: ["border-none rounded-lg"],
        }),
        summary: () => ({
          class: ["text-[16px] font-semibold"],
        }),
        detail: () => ({
          class: ["m-0"],
        }),
        icon: (slotProps: any) => ({
          class: [
            {
              "text-blue-700": slotProps.props.message.severity == "info",
              "text-green-700": slotProps.props.message.severity == "success",
              "text-orange-700": slotProps.props.message.severity == "warn",
              "text-red-700": slotProps.props.message.severity == "error",
            },
          ],
        }),
        closeIcon: (slotProps: any) => ({
          class: [
            {
              "text-blue-500 ": slotProps.props.message.severity == "info",
              "text-green-500": slotProps.props.message.severity == "success",
              "text-orange-500": slotProps.props.message.severity == "warn",
              "text-red-500": slotProps.props.message.severity == "error",
            },
          ],
        }),
      },
    },
  })
  .use(ToastService)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Toast", Toast)
  .component("Dialog", Dialog)
  .component("Dropdown", Dropdown)
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
  .component("RadioButton", RadioButton)
  .component("Checkbox", Checkbox)
  .component("Skeleton", Skeleton)
  .component("Steps", Steps)
  .component("Tag", Tag)
  .component("TieredMenu", TieredMenu)
  .component("Menu", Menu)
  .component("FloatLabel", FloatLabel)
  .component("Password", Password)
  .component("ProgressSpinner", ProgressSpinner)
  .mount("#app");

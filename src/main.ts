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

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, {
    // pt: {
    //   Toast: {
    //     container: (slotProps: any) => ({
    //       class: [
    //         "rounded-lg w-full border-solid border-0 border-l-[6px] shadow-md",
    //         {
    //           "border-blue-500": slotProps.props.message.severity == "info",
    //           "border-green-500": slotProps.props.message.severity == "success",
    //           "border-orange-500": slotProps.props.message.severity == "warn",
    //           "border-red-500": slotProps.props.message.severity == "error",
    //         },
    //           {
    //             "bg-blue-300": slotProps.props.message.severity == "info",
    //             "bg-green-300": slotProps.props.message.severity == "success",
    //             "bg-orange-300": slotProps.props.message.severity == "warn",
    //             "bg-red-300": slotProps.props.message.severity == "error",
    //           },
    //           {
    //             "text-blue-500": slotProps.props.message.severity == "info",
    //             "text-green-500": slotProps.props.message.severity == "success",
    //             "text-orange-500": slotProps.props.message.severity == "warn",
    //             "text-red-500": slotProps.props.message.severity == "error",
    //           },
    //         ],
    //       }),
    //       content: (slotProps: any) => ({
    //         class: ["border-none rounded-lg"],
    //       }),
    //       detail: () => ({
    //         class: ["m-0"],
    //       }),
    //       icon: (slotProps: any) => ({
    //         class: [
    //           {
    //             "text-blue-500": slotProps.props.message.severity == "info",
    //             "text-green-500": slotProps.props.message.severity == "success",
    //             "text-orange-500": slotProps.props.message.severity == "warn",
    //             "text-red-500": slotProps.props.message.severity == "error",
    //           },
    //         ],
    //       }),
    //       closeIcon: (slotProps: any) => ({
    //         class: [
    //           {
    //             "text-blue-500 ": slotProps.props.message.severity == "info",
    //             "text-green-500": slotProps.props.message.severity == "success",
    //             "text-orange-500": slotProps.props.message.severity == "warn",
    //             "text-red-500": slotProps.props.message.severity == "error",
    //           },
    //         ],
    //       }),
    //     },
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

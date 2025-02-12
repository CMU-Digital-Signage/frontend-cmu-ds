<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DeviceBlock",
});
</script>
<script setup lang="ts">
import store from "@/store";
import { toRefs, defineProps } from "vue";
import { Device } from "@/types";
import { copyToClipboard, webAppUrl } from "@/utils/constant";
import { useToast } from "primevue/usetoast";
// import { turnOnOffDevice } from "@/services";

const props = defineProps<{ device: Device }>();
const { device } = toRefs(props);
const toast = useToast();
// const onOff = ref(false);
// const loading = ref(false);

// const changeStatusDevice = async () => {
//   loading.value = true;
//   if (device.value.MACaddress) {
//     onOff.value = device.value.status;
//     await turnOnOffDevice(device.value.MACaddress);
//   }
// };

// watch(
//   () =>
//     store.state.devices?.find((e) => e.MACaddress === device.value.MACaddress)
//       ?.status,
//   () => {
//     if (device.value.status !== onOff.value) {
//       onOff.value = device.value.status;
//       loading.value = false;
//     }
//   }
// );
</script>

<template>
  <div class="relative inline-flex">
    <Button
      @click="
        $router.push(`/preview/${device.MACaddress}`);
        store.state.openSidebar = true;
      "
      class="button1 size-fit bg-[#f3f3f3] hover:bg-gray-200"
    >
      <i
        :class="[
          device.status ? 'text-[#62ccca]' : 'text-gray-400',
          'pi pi-desktop',
          'text-[50px]',
        ]"
      ></i>
      <div class="mr-7">
        <p
          :class="[
            device.status ? 'text-black' : 'text-gray-500',
            'font-bold',
            'text-[14px]',
          ]"
        >
          {{ device.deviceName }}
        </p>
        <p
          :class="[
            device.status ? 'text-black' : 'text-gray-500',
            'text-[12px]',
          ]"
        >
          Room: {{ device.room }}
        </p>
        <!-- <p class="text-gray-500 font-bold" v-if="device.status == false">Off</p>
        <p class="text-[#62ccca] font-bold" v-if="device.status == true">On</p> -->
      </div>
    </Button>
    <div
      v-if="store.state.userInfo.isAdmin"
      class="flex absolute top-2 right-2"
    >
      <Button
        class="w-7 h-7 border-0 mr-1 mt-1 bg-[#62ccca]"
        icon="pi pi-external-link"
        :title="`${webAppUrl}/device/${device.MACaddress}`"
        rounded
        @click="
          copyToClipboard(`${webAppUrl}/device/${device.MACaddress}`, toast)
        "
      ></Button>
    </div>
    <!-- <div
      v-if="store.state.userInfo.isAdmin"
      class="flex absolute bottom-2 right-2"
    >
      <Button
        class="w-7 h-7 border-0 mr-1 mb-1"
        :class="[device.status ? 'bg-[#62ccca]' : 'bg-[#b3b2b2]']"
        icon="pi pi-power-off"
        rounded
        :loading="loading"
        @click="changeStatusDevice"
      ></Button>
    </div> -->
  </div>
</template>

<style scope>
.button1 {
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 25px;
  text-align: left;
  border-color: #bbbaba;
  padding: 20px 25px;
}
</style>

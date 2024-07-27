<script lang="ts">
import { defineComponent } from "vue";
import { editGlanceBarByDevice } from "@/services/device";
export default defineComponent({
  name: "GlanceBarCompo",
});
</script>
<script setup lang="ts">
import { ref, defineProps, computed, watch, reactive } from "vue";
import { dateFormatter, timeFormatter } from "@/utils/constant";
import { Device } from "@/types";
import { useToast } from "primevue/usetoast";

type Props = {
  onEdit: (MACaddress: string | undefined) => void;
  device: Device;
};
const props = defineProps<Props>();
const toast = useToast();
const dateTime = ref<Date>(new Date());
const form = reactive<Partial<Device>>({});
const destination1 = ref("");
const destination2 = ref("");
const selectedPosition = ref("left");
const selectedColor = ref("yellow");
const selectedDirection = ref<number | null>(null);
const isEdit = ref(false);
const isSmall = computed(() => props.device.isSmall || form.isSmall);
const sizes = [
  { label: "Small", value: true },
  { label: "Large", value: false },
];
const positions = [
  { label: "Left Panel", value: "left" },
  { label: "Right Panel", value: "right" },
];
const colors = [
  { label: "Yellow", value: "yellow", color: "#FFC008" },
  { label: "Green", value: "green", color: "#14C6A4" },
];
const directions = [
  { label: "Go Straight", value: -90, arrow: "-rotate-90" },
  { label: "Go Back", value: 90, arrow: "rotate-90" },
  { label: "Turn Left", value: 180, arrow: "rotate-180" },
  { label: "Turn Right", value: 0, arrow: "" },
];
const textContent = computed(() => {
  return isSmall.value ? "XXX" : "XXXXXXXXXX";
});

watch(isEdit, () => {
  if (isEdit.value) {
    props.onEdit(props.device.MACaddress);
    form.isSmall = props.device.isSmall ?? true;
  } else {
    props.onEdit(undefined);
    Object.assign(form, {});
    form.isSmall = props.device.isSmall ?? false;
    selectedDirection.value = null;
    selectedPosition.value = "left";
    selectedColor.value = "yellow";
    destination1.value = "";
    destination2.value = "";
  }
});

watch(isSmall, (newSize) => {
  if (!newSize) {
    selectedPosition.value = "center";
  } else if (selectedPosition.value === "center") {
    selectedPosition.value = "left";
  }
  destination1.value = "";
  destination2.value = "";
});

watch(selectedPosition, (newPos) => {
  if (newPos === "left" && selectedDirection.value === 0) {
    selectedDirection.value = 180;
  } else if (newPos === "right" && selectedDirection.value === 180) {
    selectedDirection.value = 0;
  }
});

watch(destination1, () => {
  if (!destination1.value.length && destination2.value.length) {
    destination2.value = "";
  }
});

const editDest = async (isDelete = false, option?: string) => {
  if (isDelete && option?.length) {
    Object.assign(form, {});
    if (["large", "left"].includes(option)) {
      form.color1 = null;
      form.arrow1 = null;
      form.desc1 = null;
      if (props.device.arrow2 === null) {
        form.isSmall = null;
      }
    }
    if (["large", "right"].includes(option)) {
      form.color2 = null;
      form.arrow2 = null;
      form.desc2 = null;
      if (props.device.arrow1 === null) {
        form.isSmall = null;
      }
    }
  } else {
    form.isSmall = selectedPosition.value === "center" ? false : true;
    if (["center", "left"].includes(selectedPosition.value)) {
      form.color1 = selectedColor.value;
      form.arrow1 = selectedDirection.value;
      form.desc1 = destination1.value;
      if (destination2.value.length) {
        form.desc1 += ` ${destination2.value}`;
      }
    } else if (selectedPosition.value === "right") {
      form.color2 = selectedColor.value;
      form.arrow2 = selectedDirection.value;
      form.desc2 = destination1.value;
      if (destination2.value.length) {
        form.desc2 += ` ${destination2.value}`;
      }
    }
  }
  const res = await editGlanceBarByDevice(props.device.MACaddress!, form);
  if (res.ok) {
    isEdit.value = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: res.message,
      life: 3000,
    });
    Object.assign(form, {});
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: res.message,
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="glance-bar-box">
    <div
      class="flex w-full h-full justify-between items-center bg-[#0e1235] text-white rounded-lg py-5"
    >
      <!-- Date -->
      <div class="lg:ml-5 ml-3">
        <p class="text-4xl md:text-5xl lg:text-6xl font-bold">
          {{ timeFormatter(dateTime) }}
        </p>
        <p class="text-2xl md:text-3xl lg:text-4xl">
          {{ dateFormatter(dateTime, 3) }}
        </p>
      </div>
      <!-- AQI -->
      <div class="flex flex-col h-full">
        <div class="flex h-full justify-center">
          <div
            class="lg:px-4 px-3 items-center flex justify-center rounded-l-lg rounded-tr-none bg-[#228b25]"
          >
            <p class="lg:text-xl text-lg">28 °C</p>
          </div>
          <div
            class="flex flex-row rounded-r-lg rounded-bl-none bg-[#43a027] px-4 md:px-6 gap-4"
          >
            <div class="flex flex-col pt-1 pb-3 md:py-5 justify-center">
              <p class="lg:text-4xl text-3xl font-semibold">30</p>
              <p class="lg:text-xl text-lg">US AQI</p>
            </div>
            <div
              class="lg:text-xl text-lg items-center font-medium flex flex-1 justify-center"
            >
              Good
            </div>
          </div>
        </div>
        <div class="text-xs text-center font-medium text-white mr-3 mt-2">
          Last updated:
          {{ dateTime.getHours().toString().padStart(2, "0") }}:{{
            dateTime.getMinutes().toString().padStart(2, "0")
          }}
          | IQAir
        </div>
      </div>
      <!-- Direction -->
      <div class="flex w-2/5 h-full gap-2.5 lg:text-[20px] text-[16px]">
        <div v-if="isSmall" class="split-sections">
          <div
            :class="[
              `extra-section ${
                device.color1 === 'green' ? 'text-[#14C6A4]' : 'text-[#FFC008]'
              }`,
              { 'border-blink': isEdit && selectedPosition === 'left' },
              { '!border-solid': device.arrow1 !== null },
              { 'cursor-pointer': device.arrow1 === null },
            ]"
            @click="
              if (device.arrow1 === null) {
                isEdit = true;
                selectedPosition = 'left';
              }
            "
          >
            <div
              v-if="device.arrow1 !== null"
              :class="[
                'flex items-center',
                { 'flex-row-reverse !text-end': device.arrow1 === 0 },
              ]"
            >
              <i
                class="absolute -top-2 -left-2 pi pi-minus rounded-full bg-white text-[#575757] p-1 cursor-pointer"
                style="font-size: 10px"
                @click="() => editDest(true, 'left')"
              ></i>
              <img
                alt="arrow1"
                :src="
                  device.color1 === 'green'
                    ? require('../assets/images/arrowGreen.png')
                    : require('../assets/images/arrow.png')
                "
                :class="[
                  'lg:size-12 size-8',
                  {
                    '-rotate-90': device.arrow1 === -90,
                    'rotate-90': device.arrow1 === 90,
                    'rotate-180': device.arrow1 === 180,
                  },
                ]"
              />
              <div class="flex flex-col whitespace-break-spaces">
                {{ device.desc1?.replace(" ", "\n") }}
              </div>
            </div>
            <i
              v-else-if="!isEdit"
              class="pi pi-plus rounded-full bg-white text-[#575757] p-2"
            ></i>
          </div>
          <div
            :class="[
              `extra-section ${
                device.color2 === 'green' ? 'text-[#14C6A4]' : 'text-[#FFC008]'
              }`,
              { 'border-blink': isEdit && selectedPosition === 'right' },
              { '!border-solid': device.arrow2 !== null },
              { 'cursor-pointer': device.arrow2 === null },
              { 'flex-row-reverse !text-end': device.arrow2 === 0 },
            ]"
            @click="
              if (device.arrow2 === null) {
                isEdit = true;
                selectedPosition = 'right';
              }
            "
          >
            <div
              v-if="device.arrow2 !== null"
              :class="[
                'flex items-center',
                { 'flex-row-reverse !text-end': device.arrow2 === 0 },
              ]"
            >
              <i
                class="absolute -top-2 -left-2 pi pi-minus rounded-full bg-white text-[#575757] p-1 cursor-pointer"
                style="font-size: 10px"
                @click="() => editDest(true, 'right')"
              ></i>
              <img
                alt="arrow2"
                :src="
                  device.color2 === 'green'
                    ? require('../assets/images/arrowGreen.png')
                    : require('../assets/images/arrow.png')
                "
                :class="[
                  'lg:size-12 size-8',
                  {
                    '-rotate-90': device.arrow2 === -90,
                    'rotate-90': device.arrow2 === 90,
                    'rotate-180': device.arrow2 === 180,
                  },
                ]"
              />
              <div class="flex flex-col whitespace-break-spaces">
                {{ device.desc2?.replace(" ", "\n") }}
              </div>
            </div>
            <i
              v-else-if="!isEdit"
              class="pi pi-plus rounded-full bg-white text-[#575757] p-2"
            ></i>
          </div>
        </div>
        <div
          v-else
          :class="[
            `extra-section ${
              device.color1 === 'green' ? 'text-[#14C6A4]' : 'text-[#FFC008]'
            }`,
            { 'border-blink': isEdit },
            { '!border-solid': device.arrow1 !== null },
            { 'cursor-pointer': device.arrow1 === null },
          ]"
          @click="isEdit = device.isSmall === null ? true : false"
        >
          <div
            v-if="device.arrow1 !== null"
            :class="[
              'flex items-center',
              { 'flex-row-reverse !text-end': device.arrow1 === 0 },
            ]"
          >
            <i
              class="absolute -top-2 -left-2 pi pi-minus rounded-full bg-white text-[#575757] p-1 cursor-pointer"
              style="font-size: 10px"
              @click="() => editDest(true, 'large')"
            ></i>
            <img
              alt="arrow1"
              :src="
                device.color1 === 'green'
                  ? require('../assets/images/arrowGreen.png')
                  : require('../assets/images/arrow.png')
              "
              :class="[
                'lg:size-12 size-8',
                {
                  '-rotate-90': device.arrow1 === -90,
                  'rotate-90': device.arrow1 === 90,
                  'rotate-180': device.arrow1 === 180,
                },
              ]"
            />
            <div class="flex flex-col whitespace-break-spaces">
              {{ device.desc1?.replace(" ", "\n") }}
            </div>
          </div>
          <i
            v-else-if="!isEdit"
            class="pi pi-plus rounded-full bg-white text-[#575757] p-2"
          ></i>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Panel -->
  <div v-if="isEdit" class="bottom-panel absolute left-0 bottom-0 rounded-t-xl">
    <!-- Action -->
    <div
      :class="[
        'flex mb-5',
        { 'justify-between': device.isSmall === null },
        { 'justify-end': device.isSmall !== null },
      ]"
    >
      <div v-if="device.isSmall === null" class="flex gap-3 text-center">
        <div>
          <div class="button-group bg-[#E1E1E1] p-1 rounded-xl">
            <button
              class="rounded-xl"
              v-for="size in sizes"
              :key="size.label"
              :class="{ active: form.isSmall === size.value }"
              @click="form.isSmall = size.value"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
        <div v-if="isSmall">
          <div class="button-group bg-[#E1E1E1] p-1 rounded-xl">
            <button
              class="rounded-xl flex flex-row items-center justify-center gap-2"
              v-for="position in positions"
              :key="position.value"
              :class="{ active: selectedPosition === position.value }"
              @click="selectedPosition = position.value"
            >
              <img alt="panel" src="../assets/images/Panel.png" />
              {{ position.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="rounded-xl flex gap-3">
        <button @click="isEdit = false" class="rounded-lg">Cancel</button>
        <button
          @click="() => editDest()"
          class="!text-white !bg-[#14c6a4] hover:!bg-[#109980] rounded-lg"
        >
          Done
        </button>
      </div>
    </div>

    <div class="flex w-full">
      <!-- Radio -->
      <div class="flex w-[55%]">
        <div :class="['flex', { 'flex-wrap': !isSmall }]">
          <div v-for="(dir, index) in directions" :key="dir.label">
            <div
              v-if="
                (dir.value !== 0 &&
                  (!isSmall || selectedPosition !== 'right')) ||
                (dir.value !== 180 && (!isSmall || selectedPosition !== 'left'))
              "
              class="image-container"
              :class="[
                isSmall ? 'small' : 'large',
                selectedPosition,
                { 'lg:mr-15 mr-5': isSmall && index !== directions.length - 1 },
                {
                  'mr-5': !isSmall && index !== directions.length - 1,
                },
              ]"
            >
              <div
                class="img-wrapper lg:text-[20px] text-[16px]"
                :class="{ 'flex-row-reverse !text-end': dir.value === 0 }"
              >
                <img
                  :class="`lg:size-12 size-8 ${dir.arrow}`"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-[#FFC107]">{{ textContent }}</p>
              </div>
              <div class="flex flex-row gap-2">
                <input
                  type="radio"
                  name="radio"
                  :value="dir.value"
                  v-model="selectedDirection"
                />
                <span class="checkmark">{{ dir.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <template v-if="selectedDirection !== null">
        <div
          :class="`border-l-2 border-l-[#c1c1c1] ml-5 ${
            isSmall ? 'mr-8' : 'mr-20'
          }`"
        ></div>
        <div
          :class="['flex w-[40%]', !isSmall ? 'flex-col' : 'flex-row gap-5']"
        >
          <div
            class="image-container"
            :class="[isSmall ? 'w-1/2 small' : 'large']"
          >
            <div
              class="img-wrapper lg:text-[20px] text-[16px]"
              :class="[
                { 'large-wrapper': !isSmall },
                { 'flex-row-reverse !text-end': selectedDirection === 0 },
              ]"
            >
              <img
                :class="[
                  'lg:size-12 size-8',
                  directions.find((dir) => dir.value === selectedDirection)
                    ?.arrow,
                ]"
                alt="arrow"
                :src="
                  selectedColor === 'green'
                    ? require('../assets/images/arrowGreen.png')
                    : require('../assets/images/arrow.png')
                "
              />
              <div
                :class="`flex flex-col ${
                  selectedColor === 'green'
                    ? 'text-[#14C6A4]'
                    : 'text-[#FFC008]'
                }`"
              >
                <p>
                  {{ !destination1.length ? textContent : destination1 }}
                </p>
                <p>{{ destination2 }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-1/2 text-start mx-auto">
            <div class="flex flex-col mb-[32px]">
              <p>
                Destination 1 <span class="text-[#FF0000] font-medium">*</span>
              </p>
              <InputText
                v-model="destination1"
                class="h-8 rounded-[8px] text-[12px]"
                :maxlength="isSmall ? 3 : 10"
                :placeholder="`Limit ${isSmall ? 3 : 10} characters Ex.41X`"
              />
            </div>
            <div class="flex flex-col mb-[15px]">
              <p>Destination 2 (Optional)</p>
              <InputText
                :disabled="!destination1.length"
                v-model="destination2"
                class="h-8 rounded-[8px] text-[12px]"
                :maxlength="isSmall ? 3 : 10"
                :placeholder="`Limit ${isSmall ? 3 : 10} characters Ex.41X`"
              />
            </div>
            <div
              class="button-group w-full justify-center bg-[#E1E1E1] p-1 rounded-xl"
            >
              <button
                class="rounded-xl w-full"
                v-for="color in colors"
                :key="color.label"
                :class="{ active: selectedColor === color.value }"
                @click="selectedColor = color.value"
              >
                <i
                  class="pi pi-circle-fill"
                  :style="{ color: color.color }"
                ></i>
                {{ color.label }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Lato", "Sarabun";
}

.glance-bar-box {
  border-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 8px -2px,
    rgba(0, 0, 0, 0.2) 0px 0px 8px -2px;
  border-width: 1px;
  border-radius: 8px;
  padding: 10px;
}

.extra-section {
  width: 90%;
  height: 100%;
  border: 2px dashed white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: transparent;
  position: relative;
  div {
    text-align: start;
    margin-inline: 20px;
  }
}

.split-sections {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 90%;
  height: 100%;
  justify-content: flex-end;
}

.border-blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    border-color: #faff5f;
    box-shadow: #faff5f 0px 0px 8px -2px, #faff5f 0px 0px 8px -2px;
  }
}

.bottom-panel {
  width: 100%;
  background-color: #f9f9f9;
  color: rgb(0, 0, 0);
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 8px -2px,
    rgba(0, 0, 0, 0.2) 0px 0px 8px -2px;
}

.button-group {
  display: flex;
  gap: 1px;
}

button {
  background-color: #e1e1e1;
  color: rgb(0, 0, 0);
  border: none;
  padding: 3px 10px;
  cursor: pointer;
}

button.active {
  background-color: white;
  color: black;
}

.image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;
}

.img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e1235;
  border-radius: 10px;
  gap: 10px;
  div {
    text-align: start;
    margin-inline: 10px;
  }
}

.small.small .img-wrapper {
  width: 180px;
  height: 90px;
}

.large.large .img-wrapper {
  width: 270px;
  height: 90px;
}

.large-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 270px !important;
  height: 90px !important;
}

.large .image-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.large .img-wrapper {
  width: 176px;
  height: 176px;
}

.left.small input[type="radio"],
.right.small input[type="radio"],
.center input[type="radio"],
.large input[type="radio"] {
  margin: 0 auto;
}

input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  margin: 0;
}

input[type="radio"]:checked {
  background-color: #14c6a4;
  position: relative;
  border: 1px solid #14c6a4;
}

input[type="radio"]:checked::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkmark {
  height: 20px;
  line-height: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>

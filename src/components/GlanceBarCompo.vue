<script lang="ts">
import { defineComponent } from "vue";
import { editGlanceBarByDevice } from "@/services/device";
import RadioButton from "primevue/radiobutton";
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

const getTextColor = (color: string | null) => {
  let style = "font-normal";
  switch (color) {
    case "green":
      style += " text-green-300";
      break;
    default:
      style += " text-yellow-400";
      break;
  }
  return style;
};

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
    if (selectedDirection.value === null || !destination1.value.length) {
      return toast.add({
        severity: "error",
        summary: "Invalid",
        detail:
          selectedDirection.value === null
            ? "Direction is empty"
            : "Destination 1 is empty",
        life: 3000,
      });
    }
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
  <div
    class="flex w-full h-full justify-between items-center bg-[#0e1235] text-white rounded-lg py-4"
  >
    <!-- Date -->
    <div class="lg:ml-5 ml-3 flex flex-col items-start">
      <p class="text-4xl md:text-2xl lg:text-4xl justify-start items-start">
        {{ timeFormatter(dateTime) }}
      </p>
      <p class="text-4xl md:text-2xl lg:text-2xl">
        {{ dateFormatter(dateTime, 3) }}
      </p>
    </div>
    <!-- AQI -->
    <div class="flex flex-col h-full">
      <div class="flex h-24 justify-center">
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
    <div
      class="flex w-2/5 h-full items-end justify-end pr-5 gap-2.5 lg:text-[22px] font-semibold text-[20px]"
    >
      <div v-if="isSmall" class="split-sections">
        <div
          :class="[
            `extra-section ${getTextColor(device.color1)}`,
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
          <div v-if="device.arrow1 !== null" :class="['flex items-center']">
            <i
              class="pi pi-minus remove-button"
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
          <i v-else-if="!isEdit" class="pi pi-plus add-button"></i>
        </div>
        <div
          :class="[
            `extra-section flex-row-reverse !text-end ${getTextColor(
              device.color2
            )}`,
            { 'border-blink': isEdit && selectedPosition === 'right' },
            { '!border-solid': device.arrow2 !== null },
            { 'cursor-pointer': device.arrow2 === null },
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
            :class="['flex items-center flex-row-reverse !text-end']"
          >
            <i
              class="pi pi-minus remove-button"
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
          <i v-else-if="!isEdit" class="pi pi-plus add-button"></i>
        </div>
      </div>
      <div
        v-else
        :class="[
          `extra-section ${getTextColor(device.color1)}`,
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
            class="absolute -top-2 -left-2 pi pi-minus hover:bg-red-400 rounded-full bg-red-300 text-[#ffffff] p-1 cursor-pointer"
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
        <i v-else-if="!isEdit" class="pi pi-plus add-button"></i>
      </div>
    </div>
  </div>

  <!-- Bottom Panel -->
  <div v-if="isEdit" class="bottom-panel ipad-landscape:text-[12px] ipad-portrait:text-[12px] absolute left-0 bottom-0 h-fit">
    <!-- Action -->
    <div
      :class="[
        'flex  mb-5',
        { 'justify-between': device.isSmall === null },
        { 'justify-end': device.isSmall !== null },
      ]"
    >
      <div v-if="device.isSmall === null" class="flex gap-6 text-center">
        <div>
          <div class="button-group ipad-landscape:text-[12px] ipad-portrait:text-[12px] bg-[#E1E1E1] text-[14px] rounded-lg">
            <Button
              v-for="size in sizes"
              :key="size.label"
              class="ipad-landscape:text-[12px] ipad-portrait:text-[12px]"
              :class="[
                `${
                  size.value
                    ? ' rounded-r-none rounded-l-lg'
                    : 'rounded-l-none rounded-r-lg'
                }`,
                { active: form.isSmall === size.value },
              ]"
              @click="form.isSmall = size.value"
            >
              {{ size.label }}
            </Button>
          </div>
        </div>
        <div v-if="isSmall">
          <div class="button-group bg-[#E1E1E1] text-[14px] rounded-lg">
            <Button
              class="rounded-md flex flex-row items-center justify-center ipad-landscape:text-[12px] ipad-portrait:text-[12px] gap-2"
              v-for="position in positions"
              :key="position.value"
              :class="[
                `${
                  position.value == 'left'
                    ? ' rounded-r-none rounded-l-lg'
                    : 'rounded-l-none rounded-r-lg'
                }`,
                { active: selectedPosition === position.value },
              ]"
              @click="selectedPosition = position.value"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                :class="{
                  'rotate-180': position.value === 'left',
                  'text-[#129a8f]': selectedPosition == position.value,
                }"
              >
                <path
                  d="M19.9999 11.2368C19.9999 11.9697 19.6706 12.6725 19.0845 13.1907C18.4983 13.7089 17.7033 14 16.8744 14L3.12544 14C2.2965 14 1.50151 13.7089 0.915365 13.1907C0.329216 12.6725 -7.82944e-05 11.9697 -7.82944e-05 11.2368L-7.82944e-05 2.76316C-7.82944e-05 2.03032 0.329216 1.3275 0.915365 0.80931C1.50151 0.291117 2.2965 1.78814e-07 3.12544 1.78814e-07L16.8736 1.78814e-07C17.7025 1.78814e-07 18.4975 0.291117 19.0836 0.80931C19.6698 1.3275 19.9991 2.03032 19.9991 2.76316L19.9999 11.2368ZM3.12544 1.10526C2.62808 1.10526 2.15109 1.27993 1.7994 1.59085C1.44771 1.90177 1.25013 2.32346 1.25013 2.76316L1.25013 11.2368C1.25013 11.6765 1.44771 12.0982 1.7994 12.4092C2.15109 12.7201 2.62808 12.8947 3.12544 12.8947L9.58152 12.8947L9.58152 1.10526L3.12544 1.10526Z"
                  fill="currentColor"
                />
              </svg>

              {{ position.label }}
            </Button>
          </div>
        </div>
      </div>
      <div class="rounded-xl flex gap-3">
        <Button
          @click="isEdit = false"
          class="rounded-lg text-[14px]  ipad-landscape:text-[12px] ipad-portrait:text-[12px] w-[80px] items-center justify-center px-4 hover:!bg-[#c9c9c9]"
        >
          Cancel
        </Button>
        <Button
          @click="() => editDest()"
          class="!text-white !bg-[#14c6a4] ipad-landscape:text-[12px] ipad-portrait:text-[12px] text-[14px] w-[72px] items-center justify-center font-semibold hover:!bg-[#109980] rounded-lg"
        >
          Done
        </Button>
      </div>
    </div>

    <div class="flex items-center justify-between w-full">
      <!-- Radio -->
      <div class="flex w-[55%] ipad-landscape:text-[12px] ipad-portrait:text-[12px] text-[14px]">
        <div :class="`${isSmall ? 'flex' : 'grid grid-cols-2 gap-6 '}`">
          <div v-for="(dir, index) in directions" :key="dir.label">
            <div
              v-if="
                (dir.value !== 0 &&
                  (!isSmall || selectedPosition !== 'right')) ||
                (dir.value !== 180 && (!isSmall || selectedPosition !== 'left'))
              "
              class="image-container cursor-pointer"
              :class="[
                isSmall ? 'small' : 'large',
                selectedPosition,
                { 'lg:mr-15 mr-5': isSmall && index !== directions.length - 1 },
              ]"
              @click="selectedDirection = dir.value"
            >
              <div
                class="img-wrapper lg:text-[16px] text-[14px]"
                :class="{
                  'flex-row-reverse !text-end':
                    dir.value === 0 || selectedPosition === 'right',
                }"
              >
                <img
                  :class="`lg:size-12 size-8 ${dir.arrow}`"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-yellow-400">{{ textContent }}</p>
              </div>
              <div class="flex items-center flex-row gap-2">
                <RadioButton
                  :value="dir.value"
                  v-model="selectedDirection"
                  :pt="{
                    box: (slotProps) => ({
                      class: [
                        {
                          'border-[#14C6A4] bg-[#14C6A4]':
                            slotProps.context.checked,
                        },
                      ],
                    }),
                  }"
                />
                <span>{{ dir.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <template v-if="selectedDirection !== null">
        <div
          :class="[
            'flex   flex-row gap-5 justify-end  ',
            `${isSmall ? ' w-[40%]' : 'w-[50%]'}`,
          ]"
        >
          <div
            class="image-container"
            :class="[isSmall ? 'w-1/2 small mb-[28px]' : 'large']"
          >
            <div
              class="img-wrapper lg:text-[20px] text-[16px]"
              :class="[
                { 'large-wrapper': !isSmall },
                {
                  'flex-row-reverse !text-end':
                    selectedDirection === 0 || selectedPosition === 'right',
                },
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
              <div :class="`flex flex-col ${getTextColor(selectedColor)}`">
                <p>
                  {{ !destination1.length ? textContent : destination1 }}
                </p>
                <p>{{ destination2 }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-1/2 text-[14px] text-start">
            <div class="flex ipad-landscape:text-[12px] ipad-portrait:text-[12px] flex-col mb-[16px]">
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
            <div class="flex ipad-landscape:text-[12px] ipad-portrait:text-[12px] flex-col mb-[15px]">
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
              class="button-group ipad-landscape:text-[12px] ipad-portrait:text-[12px] w-full justify-center bg-[#E1E1E1] rounded-md"
            >
              <Button
                class="rounded-md ipad-landscape:text-[12px] ipad-portrait:text-[12px] gap-2 justify-center w-full"
                v-for="color in colors"
                :key="color.label"
                :class="[
                  `${
                    color.value === 'yellow'
                      ? ' rounded-r-none rounded-l-lg'
                      : 'rounded-l-none rounded-r-lg'
                  }`,
                  { active: selectedColor === color.value },
                ]"
                @click="selectedColor = color.value"
              >
                <i
                  class="pi pi-circle-fill"
                  :style="{ color: color.color }"
                ></i>
                {{ color.label }}
              </Button>
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

.add-button {
  border-radius: 9999px;
  background-color: #ffffff;
  color: #575757;
  padding: 8px;
}
.add-button:hover {
  background-color: #e2e8f0;
}
.remove-button {
  position: absolute;
  top: -8px;
  left: -8px;
  cursor: pointer;
  border-radius: 9999px;
  background-color: #f55353;
  color: #ffffff;
  padding: 4px;
}
.remove-button:hover {
  background-color: #db4242;
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
    border-color: #87efac;
    box-shadow: #87efac 0px 0px 8px -2px, #87efac 0px 0px 8px -2px;
  }
}

.bottom-panel {
  width: 100%;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 8px -2px,
    rgba(0, 0, 0, 0.2) 0px 0px 8px -2px;
}

.button-group {
  display: flex;
}

button {
  background-color: #eaeaea;
  color: rgb(0, 0, 0);
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button.active {
  background-color: #4bffed4d;
  color: #129a8f;
  font-weight: 700;
  border-color: #129a8f;
  border-width: 1px;
  border-style: solid;
}

.image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  width: 240px;
  height: 140px;
}

.large.large .img-wrapper {
  width: 290px;
  height: 120px;
}

@media (max-width: 1024px) or (max-height: 768px) {
  .small.small .img-wrapper {
    width: 170px;
    height: 130px;
  }

  .large.large .img-wrapper {
    width: 200px;
    height: 100px;
  }
}

.large-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  width: 290px !important;
  height: 120px !important;
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
</style>

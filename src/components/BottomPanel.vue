<script setup lang="ts">
import { defineEmits, ref, computed, watch } from "vue";
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";

const destination1 = ref("");
const destination2 = ref("");

const vlHeight = computed(() => {
  return selectedSize.value === "large" ? "430px" : "300px";
});

const limitToThreeChars = (value: string) => {
  return value.slice(0, 3);
};

watch(destination1, (newValue) => {
  destination1.value = limitToThreeChars(newValue);
});

watch(destination2, (newValue) => {
  destination2.value = limitToThreeChars(newValue);
});

const selectedRadio = ref("");

const getIconColor = (label: string) => {
  switch (label.toLowerCase()) {
    case "green":
      return "#14C6A4";
    case "yellow":
      return "#FFC008";
    default:
      return "black";
  }
};

const getArrowClass = (radio: string) => {
  switch (radio) {
    case "Go Straight":
      return "-rotate-90";
    case "Turn Left":
      return "rotate-180";
    case "Turn Right":
      return "";
    case "Go Back":
      return "rotate-90";
    default:
      return "";
  }
};

const emit = defineEmits(["close"]);

const closePanel = () => {
  emit("close");
};

const selectedSize = ref("small");
const selectedPosition = ref("left");
const selectedColor = ref("Yellow");

const sizes = [
  { label: "Small", value: "small" },
  { label: "Large", value: "large" },
];

const positions = [
  { label: "Left Panel", value: "left" },
  { label: "Right Panel", value: "right" },
];

const colors = [
  { label: "Yellow", value: "Yellow" },
  { label: "Green", value: "Green" },
];

const showPositions = computed(() => selectedSize.value !== "large");

watch(selectedSize, (newSize) => {
  if (newSize === "large") {
    selectedPosition.value = "center";
  } else if (selectedPosition.value === "center") {
    selectedPosition.value = "left";
  }
});

const textContent = computed(() => {
  return selectedSize.value === "large" ? "XXXXXXXXXXX" : "XXX";
});
</script>

<template>
  <div class="bottom-panel">
    <div class="panel-content">
      <div class="filter-groups">
        <div class="filter-group">
          <div class="button-group bg-[#E1E1E1] p-1 rounded-xl">
            <button
              class="rounded-xl"
              v-for="size in sizes"
              :key="size.value"
              :class="{ active: selectedSize === size.value }"
              @click="selectedSize = size.value"
            >
              {{ size.label }}
            </button>
          </div>
        </div>

        <div class="filter-group" v-if="showPositions">
          <div class="button-group bg-[#E1E1E1] p-1 rounded-xl">
            <button
              class="rounded-xl flex flex-row items-center justify-center gap-2"
              v-for="position in positions"
              :key="position.value"
              :class="{ active: selectedPosition === position.value }"
              @click="selectedPosition = position.value"
            >
              <img class="" alt="" src="../assets/images/Panel.png" />
              {{ position.label }}
            </button>
          </div>
        </div>
        <div class="rounded-xl absolute top-5 right-5 p-1">
          <button @click="closePanel" class="mr-1 rounded-lg">Cancel</button>
          <button @click="closePanel" class="close-button rounded-lg p-1">
            Done
          </button>
        </div>
      </div>

      <div class="flex flex-row">
        <div class="flex flex-row gap-20 w-[55%]">
          <div
            :class="[
              'flex',
              selectedSize === 'large' ? 'flex-col gap-0' : 'flex-row gap-20',
            ]"
          >
            <div
              class="image-container"
              :class="[selectedSize, selectedPosition]"
            >
              <div class="img-wrapper">
                <img
                  class="arrow-image -rotate-90"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-[#FFC107]">{{ textContent }}</p>
              </div>
              <div class="flex flex-row gap-2">
                <input
                  type="radio"
                  name="radio"
                  :value="'Go Straight'"
                  v-model="selectedRadio"
                />
                <span class="checkmark">Go Straight</span>
              </div>
            </div>
            <div
              v-if="!(selectedSize === 'small' && selectedPosition === 'right')"
              class="image-container"
              :class="[selectedSize, selectedPosition]"
            >
              <div class="img-wrapper">
                <img
                  class="arrow-image rotate-180"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-[#FFC107]">{{ textContent }}</p>
              </div>
              <div class="flex flex-row gap-2">
                <input
                  type="radio"
                  name="radio"
                  :value="'Turn Left'"
                  v-model="selectedRadio"
                />
                <span class="checkmark">Turn Left</span>
              </div>
            </div>
          </div>
          <div
            :class="[
              'flex',
              selectedSize === 'large' ? 'flex-col gap-0' : 'flex-row gap-20',
            ]"
          >
            <div
              v-if="!(selectedSize === 'small' && selectedPosition === 'left')"
              class="image-container"
              :class="[selectedSize, selectedPosition]"
            >
              <div class="img-wrapper">
                <img
                  class="arrow-image"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-[#FFC107]">{{ textContent }}</p>
              </div>
              <div class="flex flex-row gap-2">
                <input
                  type="radio"
                  name="radio"
                  :value="'Turn Right'"
                  v-model="selectedRadio"
                />
                <span class="checkmark">Turn Right</span>
              </div>
            </div>
            <div
              class="image-container"
              :class="[selectedSize, selectedPosition]"
            >
              <div class="img-wrapper">
                <img
                  class="arrow-image rotate-90"
                  alt="arrow"
                  src="../assets/images/arrow.png"
                />
                <p class="text-[#FFC107]">{{ textContent }}</p>
              </div>
              <div class="flex flex-row gap-2">
                <input
                  type="radio"
                  name="radio"
                  :value="'Go Back'"
                  v-model="selectedRadio"
                />
                <span class="">Go Back</span>
              </div>
            </div>
          </div>
        </div>
        
        <template v-if="selectedRadio">
          <div class="vl" :style="{ height: vlHeight }"></div>
          <div
            :class="[
              'flex',
              selectedSize === 'large' ? 'flex-col ml-24' : 'flex-row',
            ]"
          >
            <div
              :class="[selectedSize === 'large' ? ' w-full' : 'ml-8']"
            >
              <div class="image-container" :class="[selectedSize]">
                <div
                  class="img-wrapper"
                  :class="{ 'large-wrapper': selectedSize === 'large' }"
                >
                  <img
                    :class="[
                      'arrow-image',
                      getArrowClass(selectedRadio),
                      { 'large-arrow': selectedSize === 'large' },
                    ]"
                    alt="arrow"
                    src="../assets/images/arrow.png"
                  />
                  <p class="text-[#FFC107]">{{ textContent }}</p>
                </div>
              </div>
            </div>
            <div
              :class="[
                'flex flex-col',
                selectedSize === 'large' ? 'ml-5' : 'ml-5',
              ]"
            >
              <div class="flex flex-row">
                <p>Destination 1&nbsp;</p>
                <p class="text-red-600">*</p>
              </div>
              <div class="flex justify-center items-center">
                <InputText
                  v-model="destination1"
                  type="text"
                  size="small"
                  maxlength="3"
                  class="black-text-input"
                  style="width: 300px; border-radius: 7px"
                  placeholder="Limit 3 characters Ex. 41X"
                />
              </div>
              <div class="flex flex-row mt-4">
                <p>Destination 2 (Optional)</p>
              </div>
              <div class="flex justify-center items-center mt-1">
                <InputText
                  v-model="destination2"
                  type="text"
                  size="small"
                  maxlength="3"
                  class="black-text-input"
                  style="width: 300px; border-radius: 7px; margin-bottom: 15px"
                  placeholder="Limit 3 characters Ex. 41X"
                />
              </div>
              <div
                class="button-group justify-center bg-[#E1E1E1] p-1 rounded-xl w-[250px] mb-10"
              >
                <button
                  class="rounded-xl w-[125px]"
                  v-for="color in colors"
                  :key="color.value"
                  :class="{ active: selectedColor === color.value }"
                  @click="selectedColor = color.value"
                >
                  <i
                    class="pi pi-circle-fill"
                    :style="{ color: getIconColor(color.label) }"
                  ></i>
                  {{ color.label }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.black-text-input {
  color: black !important;
}

.black-text-input::placeholder {
  color: #999;
}

.bottom-panel {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f9f9f9;
  color: rgb(0, 0, 0);
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.panel-content {
  max-width: 100%;
  margin: 0 auto;
}

.filter-groups {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  justify-content: left;
  gap: 20px;
}

.filter-group {
  text-align: center;
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
  margin-bottom: 20px;
  gap: 10px;
}

.img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e1235;
  border-radius: 10px;
  gap: 10px;
}

.arrow-image {
  max-width: 100%;
  max-height: 100%;
}

.small .arrow-image {
  width: 44px;
  height: 44px;
}

.large .arrow-image {
  width: 44px;
  height: 44px;
}

.small.small .img-wrapper {
  width: 203px;
  height: 148px;
}

.large.large .img-wrapper {
  width: 340px;
  height: 148px;
}

.large-wrapper {
  width: 340px !important;
  height: 148px !important;
}

.large-arrow {
  width: 44px !important;
  height: 44px !important;
}

.large-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.large .image-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.close-button {
  background-color: #14c6a4;
  color: white;
}

.close-button:hover {
  background-color: #109980;
}

.large .img-wrapper {
  width: 176px;
  height: 176px;
  margin: 0 auto;
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

.vl {
  border-left: 2px solid #c1c1c1;
  margin-top: -50px;
}
</style>
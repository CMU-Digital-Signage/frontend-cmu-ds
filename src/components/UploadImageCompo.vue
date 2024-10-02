<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UploadImage",
});
</script>
<script setup lang="ts">
import { computed, ref, toRefs, defineProps, onMounted } from "vue";
import { convertUrlToFile, onUpload, rotate } from "@/utils/constant";
import store from "@/store";
import { CONTENT_CODE } from "@/utils/enum";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
  posType: string;
  maxContent: number | undefined;
}>();
const { posType, maxContent } = toRefs(props);
const formPoster = computed(() => store.state.formPoster);
const formEmer = computed(() => store.state.formEmer);
const toast = useToast();
const fileUpload = ref();
const loading = ref(false);
const videoEl = ref<HTMLVideoElement | null>();
const playing = ref(false);
const isHoveredVideo = ref(false);

onMounted(async () => {
  if (formPoster.value.image) {
    loading.value = true;
    await Promise.all(
      formPoster.value.image.map(async (p) => {
        if (p.image && typeof p.image === "string")
          p.image = await convertUrlToFile(p.image);
      })
    );
    loading.value = false;
  }
});

const checkVideoDuration = () => {
  if (videoEl.value) {
    const duration = videoEl.value.duration + 0.5; // +0.5 for delay before transition
    if (maxContent.value && duration > maxContent.value) {
      removeContent(0);
      errorSelectFile();
    } else {
      store.state.formDisplay.forEach((e) => (e.duration = duration));
    }
  }
};

const togglePlay = () => {
  if (playing.value) {
    videoEl.value?.pause();
  } else {
    videoEl.value?.play();
  }
};

const errorSelectFile = async (isFromComp = false) => {
  if (isFromComp) {
    const message = fileUpload.value.messages[0]
      .split(": ")
      .slice(1)
      .join(" ")
      .split(", ");
    toast.add({
      severity: "error",
      summary: message[0],
      detail: message[1],
      life: 3000,
    });
  }
  //  if (
  //   maxContent.value &&
  //   (formPoster.value.image?.length + fileUpload.value.files.length >=
  //     maxContent.value ||
  //     (videoEl.value && videoEl.value?.duration > maxContent.value))
  // )
  else {
    toast.add({
      severity: "error",
      summary: "Invalid file limit",
      detail: `File limit : ${maxContent.value} ${
        posType.value === CONTENT_CODE.Video ? "seconds" : "images"
      }`,
      life: 3000,
    });
  }
};

const selectContent = async (event: any) => {
  loading.value = true;
  if (!store.state.formPoster.image) {
    store.state.formPoster.image = [];
  }
  if (
    posType.value === CONTENT_CODE.Video &&
    store.state.formPoster.image.length
  ) {
    removeContent(0);
  }
  const initialLength = store.state.formPoster.image.length;
  const filePromises = event.files.map(async (e: any, i: number) => {
    const priority = initialLength + i + 1;
    const file = await onUpload(e, posType.value);
    file.name = `${formPoster.value.title}-${priority}.${e.name
      .split(".")
      .pop()}`;
    return {
      image: file,
      priority: priority,
    };
  });
  const processedFiles = await Promise.all(filePromises);
  store.state.formPoster.image.push(...processedFiles);
  loading.value = false;
};

const removeContent = (i: number) => {
  store.state.formPoster.image.splice(i, 1);
  store.state.formPoster.image.forEach((e, index) => {
    e.priority = index + 1;
    e.image.name = `${formPoster.value.title}-${index + 1}.${e.image.name
      .split(".")
      .pop()}`;
  });
};
</script>

<template>
  <FileUpload
    ref="fileUpload"
    class="mt-12"
    :accept="posType === CONTENT_CODE.Video ? 'video/mp4' : 'image/*'"
    :show-upload-button="false"
    :multiple="[CONTENT_CODE.Poster].includes(posType as CONTENT_CODE)"
    :fileLimit="posType === CONTENT_CODE.Poster ? maxContent : 1"
    :maxFileSize="52428800"
    @select="
      async (e: any) => {
        if (posType === 'EP' && e.files[0]) {
          formEmer.emergencyImage = await onUpload(e.files[0], posType);
        } else if (
          e.files[0] &&
          maxContent &&
          formPoster.image.length + e.files.length <= maxContent
        ) {
          selectContent(e);
        } else errorSelectFile(true);
        if (e.files.length) e.files.splice(0, e.files.length);
      }
    "
  >
    <template #header="{ chooseCallback }">
      <Button
        @click="chooseCallback()"
        icon="pi pi-plus text-[14px]"
        label="Choose File"
        class="rounded-2xl h-fit w-fit text-[14px] border-[#14C6A4] text-[#14C6A4] font-bold hover:bg-[#14C6A433]"
        outlined
      />
    </template>
    <template #content="{ removeFileCallback }">
      <ProgressSpinner
        v-if="loading"
        strokeWidth="6"
        animationDuration=".5s"
        class="flex flex-col text-center items-center"
      />
      <div
        v-else-if="posType === 'EP' && formEmer.emergencyImage"
        class="w-full flex justify-center items-center -ml-[33px]"
      >
        <div
          class="flex flex-col items-end justify-end w-fit gap-6 px-5 bg-white rounded-lg"
        >
          <div
            class="flex flex-row justify-center text-center items-center gap-3 w-full"
          >
            <p class="text-[14px] text-[#575757]">Logo <br />TV</p>
            <div
              class="flex items-center justify-center bg-[#282828] border-[#D3D1D1] rounded-md shadow-md"
              :style="{
                width: `${2160 / 11}px`,
                height: `${3840 / 11}px`,
              }"
            >
              <div
                class="flex justify-center bg-black shadow-sm shadow-slate-600 rounded-md"
                :style="{
                  width: `${2160 / 12}px`,
                  height: `${3840 / 12}px`,
                }"
              >
                <img
                  :alt="formEmer.incidentName"
                  :src="formEmer.emergencyImage.dataURL"
                  class="max-w-full max-h-full m-auto rotate-90"
                  :style="{
                    maxWidth: `${3840 / 12}px`,
                    maxHeight: `${2160 / 12}px`,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="inline-flex gap-4 justify-center w-[196px]">
            <Button
              @click="
                async () => {
                  formEmer.emergencyImage.dataURL = await rotate(
                    formEmer.emergencyImage.dataURL,
                    -90
                  );
                }
              "
              class="bg-white border-[#0FAB8D] hover:bg-[#0FAB8D] hover:bg-opacity-15 w-12 h-12"
              :class="`${formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'}`"
              rounded
              outlined
            >
              <template v-slot:icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="23"
                  viewBox="0 0 17 19"
                  fill="none"
                >
                  <path
                    d="M11.6639 4.93987C12.1409 5.29747 12.6343 5.15464 12.6343 4.52594V3.43683H12.658C14.3836 3.43683 15.4727 4.62976 15.4727 6.33128C15.4727 7.38883 15.147 7.78681 15.1233 8.07283C15.1151 8.2954 15.1945 8.43078 15.3777 8.51831C15.624 8.6374 15.9104 8.52612 16.0454 8.2954C16.2921 7.87401 16.4668 7.1744 16.4668 6.32347C16.4668 4.04924 14.9482 2.51431 12.6658 2.51431H12.6339V1.34547C12.6339 0.70151 12.1487 0.558331 11.6639 0.924081L9.49314 2.51431C9.12739 2.78472 9.12739 3.09483 9.49314 3.35744L11.6639 4.93987ZM2.57477 18.4424H10.4554C11.8149 18.4424 12.4989 17.7903 12.4989 16.3986V8.53392C12.4989 7.14251 11.8149 6.4904 10.4554 6.4904H2.57477C1.21491 6.4904 0.53125 7.14251 0.53125 8.53392V16.3986C0.53125 17.7903 1.21491 18.4424 2.57477 18.4424ZM2.59852 17.162C2.05804 17.162 1.81138 16.9394 1.81138 16.3748V8.55767C1.81138 7.99344 2.05804 7.77053 2.59852 7.77053H10.4313C10.9799 7.77053 11.2184 7.99344 11.2184 8.55767V16.3748C11.2184 16.9394 10.9799 17.162 10.4313 17.162H2.59852Z"
                    fill="#0FAB8D"
                  />
                </svg>
              </template>
            </Button>
            <Button
              @click="
                async () => {
                  formEmer.emergencyImage.dataURL = await rotate(
                    formEmer.emergencyImage.dataURL,
                    90
                  );
                }
              "
              class="bg-white border-[#0FAB8D] hover:bg-[#0FAB8D] hover:bg-opacity-15 w-12 h-12"
              :class="`${formEmer.emergencyImage ? '' : 'text-[#9c9b9b]'}`"
              rounded
              outlined
            >
              <template v-slot:icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="23"
                  viewBox="0 0 17 19"
                  fill="none"
                >
                  <path
                    d="M5.33611 4.93987C4.85907 5.29747 4.36575 5.15464 4.36575 4.52594V3.43683H4.342C2.61639 3.43683 1.52728 4.62976 1.52728 6.33128C1.52728 7.38883 1.853 7.78681 1.87675 8.07283C1.88489 8.2954 1.8055 8.43078 1.62228 8.51831C1.37596 8.6374 1.08961 8.52612 0.95457 8.2954C0.707909 7.87401 0.533177 7.1744 0.533177 6.32347C0.533177 4.04924 2.05182 2.51431 4.3342 2.51431H4.36609V1.34547C4.36609 0.70151 4.85127 0.558331 5.33611 0.924081L7.50686 2.51431C7.87261 2.78472 7.87261 3.09483 7.50686 3.35744L5.33611 4.93987ZM14.4252 18.4424H6.54464C5.18512 18.4424 4.50112 17.7903 4.50112 16.3986V8.53392C4.50112 7.14251 5.18512 6.4904 6.54464 6.4904H14.4252C15.7851 6.4904 16.4688 7.14251 16.4688 8.53392V16.3986C16.4688 17.7903 15.7851 18.4424 14.4252 18.4424ZM14.4015 17.162C14.942 17.162 15.1886 16.9394 15.1886 16.3748V8.55767C15.1886 7.99344 14.942 7.77053 14.4015 7.77053H6.56873C6.02011 7.77053 5.78159 7.99344 5.78159 8.55767V16.3748C5.78159 16.9394 6.02011 17.162 6.56873 17.162H14.4015Z"
                    fill="#0FAB8D"
                  />
                </svg>
              </template>
            </Button>
          </div>
        </div>
      </div>
      <div
        v-else-if="posType === CONTENT_CODE.Video && formPoster.image?.length"
        @mouseover="isHoveredVideo = true"
        @mouseleave="isHoveredVideo = false"
        class="flex flex-col text-center justify-center items-center relative"
      >
        <video
          ref="videoEl"
          :src="formPoster.image[0].image.dataURL"
          controls
          muted
          @loadedmetadata="checkVideoDuration"
          @play="playing = true"
          @pause="playing = false"
        ></video>
        <div
          v-show="!playing || (playing && isHoveredVideo)"
          class="absolute cursor-pointer rounded-full w-10 h-10 flex items-center justify-center bg-transparent text-white border-white border-2"
          @click="togglePlay"
        >
          <font-awesome-icon v-if="!playing" icon="play" />
          <i v-else class="pi pi-pause"></i>
        </div>
      </div>
      <div v-else class="grid grid-cols-5 gap-2">
        <div
          v-for="(image, index) in formPoster.image"
          :key="image.image.name"
          class="content-image"
          @click="
            () => {
              removeFileCallback(index);
              removeContent(index);
            }
          "
        >
          <img
            loading="eager"
            :alt="image.image.name"
            :src="image.image.dataURL"
            width="100%"
            height="100%"
          />
          <div class="text-image bg-[#f85a5a]">Remove</div>
        </div>
      </div>
    </template>
    <template #empty v-if="!loading">
      <div
        v-if="!formEmer.emergencyImage && !formPoster.image?.length"
        class="flex flex-col text-center items-center"
      >
        <i
          class="pi pi-cloud-upload border-2 rounded-full text-8xl w-fit p-5"
        />
        <p class="mt-4 text-[14px] mb-0">
          Drag and drop files to here to upload.
        </p>
        <p v-if="posType === CONTENT_CODE.Video" class="text-[#14c6a4]">
          Support .mp4 only
        </p>
      </div>
    </template>
  </FileUpload>
</template>

<style>
.content-image {
  position: relative;
  display: inline-flex;
  width: 135px;
  height: 135px;
  border-width: 1px;
  border-color: black;
}

.text-image {
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  color: #000000;
  opacity: 0;
  visibility: hidden;
  align-items: center;
  justify-content: center;
}

.content-image:hover {
  cursor: pointer;
}

.content-image:hover .text-image {
  visibility: visible;
  opacity: 80%;
}

.p-message.p-message-error {
  display: none;
}
</style>

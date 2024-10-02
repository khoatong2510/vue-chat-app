<script setup lang="ts">
import { ref } from 'vue'
import { UserIcon } from '@heroicons/vue/24/solid'
import { MAX_FILE_SIZE_MB } from '@/utils/constants'
import { toBase64 } from '@/utils'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const inputRef = ref<HTMLInputElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const cropRef = ref<HTMLImageElement | null>(null)

const emit = defineEmits<{ change: [file: File] }>()
const model = defineModel<File | null>({ required: true })
const avatarUploadError = ref<string | null>(null)

const onClick = () => {
  inputRef.value?.click()
}

const onChange = async (e: any) => {
  const uploadFile = e.target.files[0] as File

  if (uploadFile.size > MAX_FILE_SIZE_MB) {
    avatarUploadError.value = 'File size is larger than 5MB'
    return
  }

  if (!uploadFile.type.includes('image')) {
    avatarUploadError.value = 'File is not image'
    return
  }

  avatarUploadError.value = null

  if (cropRef.value) {
    const url = await toBase64(uploadFile)
    cropRef.value.setAttribute('src', url)

    const cropper = new Cropper(cropRef.value, {
      viewMode: 1,
      aspectRatio: 1,
      center: true,
      modal: false,
      cropBoxResizable: false,
      autoCrop: false,
      ready() {
        const croppedOptions = {
          width: 128,
          height: 128,
        }

        cropper.crop()

        cropper.getCroppedCanvas(croppedOptions).toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], uploadFile.name)
            model.value = file
            const newUrl = await toBase64(file)
            imgRef.value?.setAttribute('src', newUrl)
          }
        })

        cropper.destroy()
      }
    })
  }
}

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="w-auto flex flex-col items-center" @click="onClick">
      <img ref="cropRef" alt="crop-image" class="absolute invisible h-0 w-0" />

      <img v-if="model" ref="imgRef" alt="profile-image" class="w-32 h-32 rounded-full cursor-pointer" />

      <div v-else
        class="p-4 rounded-full border border-solid border-onSurfaceVariant cursor-pointer hover:blur-sm transition-all duration-200 ease-in-out">
        <UserIcon class="w-32 h-32 text-onSurfaceVariant" />
      </div>

      <span class="text-sm mt-2 text-onSurfaceVariant">Upload Image</span>
    </div>

    <span v-if="avatarUploadError" class="text-xs mt-2 text-red-500">
      {{ avatarUploadError }}
    </span>

    <input ref="inputRef" type="file" accept="image/*" class="h-0" @change="onChange" />
  </div>
</template>

<style lang="postcss" scoped></style>
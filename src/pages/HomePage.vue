<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { toBase64 } from '@/utils'
import UserService from '@/services/user'
import InputField from '@/components/InputField.vue'
import { ref } from 'vue'
import { MAX_FILE_SIZE_MB } from '@/utils/constants'

const authStore = useAuthStore()
const router = useRouter()

const userName = ref<string>('')
const avatarUrl = ref<string>('')
const avatarUploadError = ref<string|null>(null)

const signOut = async () => {
  try {
    await authStore.signOut()

    router.push({ name :'login' })
  } catch (error) {
    console.error(error)
  }
}

const onChange = async (e: any) => {
  const file = e.target.files[0]
  console.log(file)

  if (file.size > MAX_FILE_SIZE_MB) {
    avatarUploadError.value = 'File size is larger than 5MB'
    return
  }

  if (!file.type.includes('image')) {
    avatarUploadError.value = 'File is not image' 
    return
  }

  avatarUrl.value = await toBase64(file)
  avatarUploadError.value = null
}

const onListUsers = async () => {
  await UserService.listUsers()
}

const onCreateUser = async () => {
  console.log("userName", userName)
  console.log("avatarUrl", avatarUrl)

  await UserService.createUser({
    name: userName.value,
    avatarUrl: avatarUrl.value
  })
}
</script>

<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="text-2xl font-semibold">
      This is a home page
    </div>
    
    <div>
      <button
        class="bg-gray-700 text-white px-2 py-2 rounded-lg" 
        @click="signOut"
      >
        Sign Out
      </button>
    </div>

    <div class="flex flex-col gap-4">
      <div>
        Create User
      </div>

      <InputField 
        v-model="userName"
        class="w-40"
        label="Name"
        type="text"
      />
      
      <input type="file" size="" @change="onChange" />

      <span class="text-sm text-red-500">
        {{ avatarUploadError }}
      </span>

      <div>
        <img
          v-if="avatarUrl && !avatarUploadError"
          :src="avatarUrl"
          class="w-52"
        >
      </div>

      <div>
        <button
          class="bg-gray-700 text-white px-2 py-2 rounded-lg" 
          @click="onCreateUser"
        >
          Create User
        </button>
      </div>
    </div> 
    
    <div>
      <button
        class="bg-gray-700 text-white px-2 py-2 rounded-lg" 
        @click="onListUsers"
      >
        List Users
      </button>
    </div>
  </div>
</template>

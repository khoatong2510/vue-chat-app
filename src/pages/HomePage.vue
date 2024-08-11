<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import UserService from '@/services/user'
import InputField from '@/components/InputField.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ref } from 'vue'
import authService from '@/services/amplify-auth'

const authStore = useAuthStore()
const router = useRouter()

const uploadFile = ref<File|null>(null)
const userName = ref<string>('')

const signOut = async () => {
  try {
    await authStore.signOut()

    router.push({ name :'login' })
  } catch (error) {
    console.error(error)
  }
}


const onListUsers = async () => {
  await UserService.listUsers()
}

const onCreateUser = async () => {
  // console.log("userName", userName)
  // console.log("avatarUrl", avatarUrl)
  

  if (!uploadFile.value)
    return
  
  const userId = authStore.user?.userId

  if (!userId)
    return

  const idToken = await authService.currentIdToken()
  // upload file to s3
  const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": uploadFile.value.type
    },
    body: uploadFile.value
  })

  console.log(res)


  // await UserService.createUser({
  //   name: userName.value,
  //   avatarUrl: avatarUrl.value
  // })
}

const onChange = (file: File) => {
  console.log("File", uploadFile.value)
}
</script>

<template>
  <div class="flex items-center justify-center h-screen w-screen bg-slate-200">
    <!-- nav -->
    <!-- <div class="h-12 sticky w-full top-0 shadow-sm border-t-0 border border-b-slate-200 border-solid flex items-center justify-between">
      <div class="p-8 font-serif">
        My Chat App
      </div>
    </div> -->

    <div class="min-w-[600px] flex flex-col gap-y-4 rounded-3xl border border-solid bg-white border-slate-200 p-8 shadow-lg">  
      <div class="">
        <p class="text-2xl font-semibold">
          Welcome to My Chat App
        </p>

        <p class="font-sans">
          Please create your profile
        </p>
      </div>
      
      <div class="flex flex-col gap-4">
        <ImageUpload 
          v-model="uploadFile" 
          @change="onChange"
        />

        <InputField 
          v-model="userName"
          class="w-full"
          label="Profile Name"
          type="text"
          placeholder="Profile name"
        />

        <div>
          <button
            class="bg-gray-700 text-white px-2 py-2 rounded-lg w-full" 
            @click="onCreateUser"
          >
            Create Profile
          </button>
        </div>
      </div> 
    </div>
  </div>

</template>

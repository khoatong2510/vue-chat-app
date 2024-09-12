<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import InputField from '@/components/InputField.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ref } from 'vue'
import authService from '@/services/amplify-auth'
import { useUserProfileStore } from '@/stores/profile'

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const router = useRouter()

const uploadFile = ref<File | null>(null)
const userName = ref<string>('')

const signOut = async () => {
  try {
    await authStore.signOut()

    router.push({ name: 'login' })
  } catch (error) {
    console.error(error)
  }
}

const onCreateUser = async () => {
  try {
    if (!uploadFile.value)
      return

    await authStore.getCurrentUser()
    const userId = authStore.user?.userId
    console.log(userId)

    if (!userId)
      return

    // upload file to s3
    const idToken = await authService.currentIdToken()
    console.log("type", uploadFile.value)
    const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": `image/${uploadFile.value.name.split('.')[1]}`
      },
      body: uploadFile.value
    })

    await userProfileStore.createUserProfile({
      id: userId,
      name: userName.value,
      avatarUrl: res.url
    })

    // router.push({ name: 'friend-suggestion' })
  } catch (error) {
    throw error
  }
}

</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-gray-100">
    <!-- nav -->
    <div class="flex-none fixed w-full top-0 flex items-end justify-end p-2">
      <button class="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 active:bg-gray-800 duration-200"
        @click="signOut">
        Sign Out
      </button>
    </div>

    <div class="flex-1 flex items-center justify-center">
      <div
        class="min-w-[600px] flex flex-col gap-y-4 rounded-3xl border border-solid bg-white border-slate-200 p-8 shadow-lg">
        <div class="">
          <p class="text-2xl font-semibold">
            Welcome to My Chat App
          </p>

          <p class="font-sans">
            Please create your profile
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <ImageUpload v-model="uploadFile" />

          <InputField v-model="userName" class="w-full" label="Profile Name" type="text" placeholder="Profile name" />

          <div>
            <button class="bg-gray-700 text-white px-2 py-2 rounded-lg w-full" @click="onCreateUser">
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
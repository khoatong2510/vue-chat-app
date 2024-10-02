<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import InputField from '@/components/InputField.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ref } from 'vue'
import authService from '@/services/amplify-auth'
import { useUserProfileStore } from '@/stores/profile'
import Button from '@/components/Button.vue'

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
    if (!uploadFile.value) {
      throw Error("No Profile Picture")
    }

    await authStore.getCurrentUser()
    const userId = authStore.user?.userId

    if (!userId)
      return

    // upload file to s3
    const idToken = await authService.currentIdToken()
    const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": `image/${uploadFile.value.name.split('.')[1]}`
      },
      body: uploadFile.value
    })

    await userProfileStore.createUserProfile({
      name: userName.value,
      avatarUrl: res.url
    })

    await userProfileStore.getUserProfile(userId)

    router.push({ name: 'friend-suggestion' })
  } catch (error) {
    throw error
  }
}

</script>

<template>
  <div class="flex-none fixed w-full top-0 flex items-end justify-end p-2">
    <Button
      type="tertiary" 
      class="w-1/12"
      @click="signOut">
      Sign Out
    </Button>
  </div>

  <div class="flex-1 flex items-center justify-center ">
    <div
      class=" flex flex-col gap-y-4 rounded-3xl border border-solid border-outlineVariant p-8 shadow-md bg-surfaceContainerLow">
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
          <Button
            class="w-full" 
            type="primary" 
            @click="onCreateUser"
          >
            Create Profile
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
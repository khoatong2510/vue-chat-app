<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useUserProfileStore } from '@/stores/profile';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

onMounted(async (): Promise<void> => {
  if (authStore.user) {
    await userProfileStore.getUserProfile(authStore.user.userId)
  
    if (!userProfileStore.id && router.currentRoute.value.name !== 'create-profile')
      router.replace({ name: 'create-profile' })
  }
})

</script>

<template>
  <RouterView />
</template>

<style lang="postcss">

</style>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const signOut = async () => {
  try {
    await authStore.signOut()

    router.push({ name :'login' })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>This is a home page</div>
  <button
    class="bg-gray-700 text-white px-2 py-2 rounded-lg" 
    @click="signOut"
  >
    Sign Out
  </button>
</template>

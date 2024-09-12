<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'
import { computed, onMounted, watch } from 'vue'


const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

onMounted(async (): Promise<void> => {
  await authStore.getCurrentUser()

  if (!authStore.user)
    return

  await userProfileStore.getUserProfile(authStore.user.userId)
  await userProfileStore.suggestFriend()
})

const friends = computed(() => userProfileStore.suggestedFriends)

</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="bg-indigo-100 p-4 rounded-lg w-1/2 h-1/2 flex flex-col items-start gap-2">
      <div class="font-semibold text-xl">
        Add friends to get started
      </div>

      <div>
        <div v-for="friend in friends" :key="friend.id">
          <div>
            {{ friend.name }}
            <!-- {{ friend.avatarUrl }} -->
          </div>
          <img :src="friend.avatarUrl">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
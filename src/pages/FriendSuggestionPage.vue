<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useUserProfileStore } from '@/stores/profile';
import { computed, onMounted } from 'vue';

const userProfileStore = useUserProfileStore()
const authStore = useAuthStore()

onMounted(async (): Promise<void> => {
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
        {{ friends?.length }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
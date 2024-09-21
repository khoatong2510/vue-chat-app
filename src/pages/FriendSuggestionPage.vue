<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue'

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

onMounted(async (): Promise<void> => {
  if (!authStore.user)
    return

  await userProfileStore.suggestFriend()
})

const { suggestedFriends } = storeToRefs(userProfileStore)

const requestFriend = async (id: string) => {
  await userProfileStore.requestFriend(id)
}

</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="bg-indigo-100 p-4 rounded-lg w-1/2 h-1/2 flex flex-col items-start gap-4">
      <div class="font-semibold text-xl">
        Add friends to get started
      </div>

      <div class="flex items-center gap-4 overflow-x-scroll w-full">
        <div 
          v-for="friend in suggestedFriends" 
          :key="friend.id"
          class="
            flex flex-col items-center gap-2 rounded-lg 
            border border-solid border-slate-400 
            bg-slate-300 bg-opacity-50 p-2 cursor-pointer
          ">
            <img :src="friend.avatarUrl" class="w-14 h-14 rounded-full">

            <div class="">
              {{ friend.name }}
            </div>

            <button 
              @click="requestFriend(friend.id)"
            >
              Add
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
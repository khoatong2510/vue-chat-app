<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUserProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue'
import Button from '@/components/Button.vue'

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

onMounted(async (): Promise<void> => {
  if (!authStore.user)
    return

  await userProfileStore.suggestFriend()
})

const { suggestedFriends } = storeToRefs(userProfileStore)

const onRequestFriend = async (id: string) => {
  await userProfileStore.requestFriend(id)
}

const onRemove = () => {

}
</script>

<template>
  <div class="bg-surface p-4 rounded-lg flex flex-col items-start gap-4">
    <div class="font-semibold text-2xl">
      Add friends to get started
    </div>

    <div class="grid grid-cols-4 gap-4 w-full mt-4">
      <div 
        v-if="suggestedFriends.length > 0"
        v-for="friend in suggestedFriends" 
        :key="friend.id"
        class="
          flex flex-col items-center gap-2 rounded-xl 
          border border-solid border-outlineVariant drop-shadow
          bg-surfaceContainerLow p-2
        ">
          <img :src="friend.avatarUrl" class="w-16 h-16 border-2 border-solid border-outline rounded-full">

          <div class="font-semibold text-lg">
            {{ friend.name }}
          </div>

          <div class="w-full flex items-center gap-2"> 
            <Button 
              type="primary"
              class="flex-1 py-1 text-sm rounded-lg"
              @click="onRequestFriend(friend.id)"
            >
              Add
            </Button>
  
            <Button
              type="tertiary"
              class="flex-1 py-1 text-sm rounded-lg"
              @click="onRemove"
            >
              Remove
            </Button>
          </div>
      </div>

      <div
        v-else
      >
        No Friend :(
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
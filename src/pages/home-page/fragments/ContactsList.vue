<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'
import Button from '@/components/Button.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import Contact from './Contact.vue'
import { ref, computed } from 'vue';
import { useUserProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia';
import { CheckIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import type { ID } from '@/types'
import filters from '@/filters'
import { useConversationStore } from '@/stores/conversation';

const emit = defineEmits(['friend', 'message'])

const userProfileStore = useUserProfileStore()
const conversationStore = useConversationStore()
const { friendRequests } = storeToRefs(userProfileStore)

const isViewRequest = ref(false)

const onRequestClick = () => {
  isViewRequest.value = true
  emit('friend')
}

const onMessageClick = () => {
  isViewRequest.value = false
  emit('message')
}

const getCapitalizeName = computed(() => (value: string) => filters.toCapital(value))

const onAccept = async (id: ID) => {
  await userProfileStore.acceptFriendRequest(id)
}

const onReject = async (id: ID) => {
  await userProfileStore.rejectFriendRequest(id)
}
</script>

<template>
  <div v-bind="$attrs"
    class="rounded-xl border border-solid border-outlineVariant bg-primaryContainer bg-opacity-50 shadow-lg flex flex-col gap-4">
    <div class="px-4 pt-4 flex items-center justify-between">
      <div class=" text-xl font-semibold">
        Contacts
      </div>

      <div class="w-12 h-12 
          rounded-full p-2 
          flex items-center justify-center cursor-pointer 
          hover:bg-gray-200 hover:shadow-md
          hover:text-slate-600 active:bg-primaryContainer active:text-onPrimaryContainer
          duration-150
          ">
        <PencilSquareIcon class="w-6 h-6" />
      </div>
    </div>

    <div class="flex items-center justify-center cursor-pointer gap-2 px-2">
      <div 
        class="
          flex-1 text-center font-semibold text-lg py-1 
          rounded-lg
          hover:bg-primaryFixed hover:shadow
          active:bg-primaryFixed active:bg-opacity-80 active:shadow-none
          duration-100
          "
          :class="!isViewRequest ? 'bg-primaryFixed' : 'bg-surfaceContainerHigh'"
          @click="onMessageClick"
        >
        Messages
      </div>

      <div class="
          flex-1 text-center font-semibold text-lg py-1 
          bg-transparent
          rounded-lg
          hover:bg-primaryFixed hover:shadow
          active:bg-primaryFixed active:bg-opacity-80 active:shadow-none
          duration-100"
          :class="isViewRequest ? 'bg-primaryFixed' : 'bg-surfaceContainerHigh'"
          @click="onRequestClick"
        >
        Requests
      </div>
    </div>

    <div>
      <div 
        v-if="!isViewRequest" 
        class="p-2 w-full h-full flex flex-col gap-y-2"
      >
        <Contact class="bg-indigo-200 bg-opacity-50 shadow-md" name="John Doe"
          avatar-url="src/assets/images/785-200x200.jpg"
          last-message="Quis nostrum exercitationem ullam corporis suscipit" last-message-at="now" />
  
      </div>

      <div v-else>
        <div 
          v-for="friend in friendRequests"
          :key="friend.id"
          class="flex items-center gap-2 bg-surfaceContainer mx-2 p-2"
        >
          <ProfileImage :src="friend.avatarUrl" :size="9" />
        
          <div class="text-sm">
            <span class="font-semibold">{{ getCapitalizeName(friend.name) }}</span> has sent you a friend request
          </div>

          <div class="flex items-center gap-2">
            <Button 
              type="secondary"
              class="w-8 h-8 p-0"
              @click="onAccept(friend.id)"
            >
              <CheckIcon class="w-4 h-4 text-onSurfaceVariant" />
            </Button>

            <Button 
              type="tertiary"
              class="w-8 h-8 p-0"
              @click="onReject(friend.id)"
            >
              <XMarkIcon class="w-4 h-4 text-onSurfaceVariant" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'
import Button from '@/components/Button.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import Contact from './Contact.vue'
import { ref, computed } from 'vue';
import { useUserProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia';
import { CheckIcon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import type { ID } from '@/types'
import filters from '@/filters'
import { useConversationStore } from '@/stores/conversation';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const emit = defineEmits(['friend', 'message'])

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const conversationStore = useConversationStore()

const { friendRequests, userProfile } = storeToRefs(userProfileStore)



const getCapitalizeName = computed(() => (value: string) => filters.toCapital(value))

const isMessageView = computed(() => {
  return router.currentRoute.value.name === 'chat'
})
const isRequestView = computed(() => {
  return router.currentRoute.value.name === 'friend'
})

const { emptyConversations } = storeToRefs(conversationStore)

const onAccept = async (id: ID) => {
  await userProfileStore.acceptFriendRequest(id)
}

const onReject = async (id: ID) => {
  await userProfileStore.rejectFriendRequest(id)
}

const onConversationClick = async (conversationId: ID) => {
  const userId = userProfileStore.userProfile?.id
  
  if (!userId)
    throw Error("User Id not found")

  const ids = conversationId.split(":")
  const fid = ids.filter(id => id !== userId)[0]
  router.push({ name: "chat", params: { id: fid }})
}

const logOut = async () => {
  await authStore.signOut()
  await userProfileStore.reset()

  router.push("/")
}

</script>

<template>
  <div v-bind="$attrs"
    class="rounded-xl border border-solid border-outlineVariant bg-surfaceContainerHighest bg-opacity-50 shadow-lg flex flex-col gap-4">
    <div class="px-4 pt-4 flex items-center justify-between">
      <div class="flex items-center justify-start gap-2">
        <ProfileImage 
          :src="userProfile?.avatarUrl || ''" 
          :size="10"
        />
        
        <div class=" text-xl font-semibold">
          {{ userProfile?.name }}
        </div>
      </div>

      <div 
        class="w-12 h-12 
        rounded-full p-2 
        flex items-center justify-center cursor-pointer 
        hover:bg-gray-200 hover:shadow-md
        hover:text-slate-600 active:bg-primaryContainer active:text-onPrimaryContainer
        duration-150
        "
        @click="logOut"
      >
        <EllipsisHorizontalIcon class="w-6 h-6" />
      </div>
    </div>

    <div class="flex items-center justify-center cursor-pointer gap-2 px-2">
      <div 
        class="
          flex-1 text-center font-semibold text-lg py-1 
          rounded-lg
          hover:bg-secondaryContainer hover:shadow
          active:bg-primaryFixed active:bg-opacity-80 active:shadow-none
          duration-100
          "
          :class="isMessageView ? 'bg-primaryFixedDim' : 'bg-surfaceContainerHigh'"
          @click="emit('message')"
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
          :class="isRequestView ? 'bg-primaryFixed' : 'bg-surfaceContainerHigh'"
          @click="emit('friend')"
        >
        Requests
      </div>
    </div>

    <div>
      <div 
        v-if="!isRequestView" 
        class="p-2 w-full h-full flex flex-col gap-y-2"
      >
        <Contact v-for="conversation in emptyConversations"
          :key="conversation.id" 
          class="bg-indigo-200 bg-opacity-50 shadow-md" 
          v-bind="conversation"
          @click="onConversationClick(conversation.id)"
        />

      </div>

      <div v-else>
        <div 
          v-for="friend in friendRequests"
          :key="friend.id"
          class="flex items-center justify-between gap-2 bg-surfaceContainer mx-2 p-2 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <ProfileImage :src="friend.avatarUrl" :size="9" />
          
            <div class="text-sm">
              <span class="font-semibold">{{ getCapitalizeName(friend.name) }}</span> has sent you a friend request
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button 
              type="primary"
              class="w-8 h-8 p-0"
              @click="onAccept(friend.id)"
            >
              <CheckIcon class="w-5 h-5 text-onPrimaryContainer" />
            </Button>

            <Button 
              type="tertiary"
              class="w-8 h-8 p-0"
              @click="onReject(friend.id)"
            >
              <XMarkIcon class="w-5 h-5 text-onTertiaryContainer" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
<script setup lang="ts">
import ProfileImage from '@/components/ProfileImage.vue'
import CustomButton from '@/components/CustomButton.vue'
import ContactListItem from './ContactListItem.vue'
import { computed } from 'vue';
import { useUserProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia';
import { CheckIcon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import type { ID } from '@/types'
import filters from '@/filters'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Store } from '@/stores/types'

interface ContactListProps {
  conversations: Store.Conversation[]
}

const props = defineProps<ContactListProps>()

const router = useRouter()
const emit = defineEmits(['friend', 'message'])

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()

const { friendRequests, userProfile } = storeToRefs(userProfileStore)

const getCapitalizeName = computed(() => (value: string) => filters.toCapital(value))

const isMessageView = computed(() => {
  return router.currentRoute.value.name === 'chat'
})
const isRequestView = computed(() => {
  return router.currentRoute.value.name === 'friend'
})

const isActiveConversation = computed(() => (conversation: Store.Conversation) => {
  return conversation.id === router.currentRoute.value.params.id
})

const onAccept = async (id: ID) => {
  await userProfileStore.acceptFriendRequest(id)
}

const onReject = async (id: ID) => {
  await userProfileStore.rejectFriendRequest(id)
}

const onConversationClick = async (conversationId: ID) => {
  router.push({ name: "chat", params: { id: conversationId }})
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
          hover:bg-primaryFixedDim hover:shadow-md hover:text-onPrimary
          active:bg-primaryFixed active:shadow-none
          duration-100
          "
          :class="isMessageView ? 'bg-primary text-onPrimary' : 'bg-surfaceContainerHigh'"
          @click="emit('message')"
        >
        Messages
      </div>

      <div class="
          flex-1 text-center font-semibold text-lg py-1 
          bg-transparent
          rounded-lg
          hover:bg-primaryFixedDim hover:shadow-md hover:text-onPrimary
          active:bg-primaryFixed active:shadow-none
          duration-100"
          :class="isRequestView ? 'bg-primary text-onPrimary' : 'bg-surfaceContainerHigh'"
          @click="emit('friend')"
        >
        Requests
      </div>
    </div>

    <div>
      <div 
        v-if="!isRequestView" 
        class="w-full h-full flex flex-col gap-y-2"
      >
        <ContactListItem 
          v-for="conversation in props.conversations"
          :key="conversation.id" 
          v-bind="conversation"
          :is-active="isActiveConversation(conversation)"
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
            <CustomButton 
              type="primary"
              class="w-8 h-8 p-0"
              @click="onAccept(friend.id)"
            >
              <CheckIcon class="w-5 h-5 text-onPrimaryContainer" />
            </CustomButton>

            <CustomButton 
              type="tertiary"
              class="w-8 h-8 p-0"
              @click="onReject(friend.id)"
            >
              <XMarkIcon class="w-5 h-5 text-onTertiaryContainer" />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
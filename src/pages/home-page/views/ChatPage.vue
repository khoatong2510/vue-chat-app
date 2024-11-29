<script setup lang="ts">
import ChatHeader from '../fragments/ChatHeader.vue'
import MessageList from '../fragments/MessagesList.vue'
import MessageInput from '../fragments/MessageInput.vue'
import { useConversationStore } from '@/stores/conversation'
import { computed, onMounted, ref, watch } from 'vue'
import { useUserProfileStore } from '@/stores/profile'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()
const conversationStore = useConversationStore()

const { conversations } = storeToRefs(conversationStore)
let currentConversation = computed(() => {
  if (router.currentRoute.value.params.id === '')
    return null

  const c = conversations.value.items.find(c => c.id === router.currentRoute.value.params.id)
  
  return c
})

</script>

<template>
<div 
  v-if="currentConversation" 
  class="h-full flex flex-col"
>
  <ChatHeader 
    :name="currentConversation.name"
    :avatar-url="currentConversation.avatarUrl"
    :active-time="new Date()"
  />

  <MessageList />

  <MessageInput />
</div>
</template>

<style lang="postcss">

</style>
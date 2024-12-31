<script setup lang="ts">
import ChatHeader from '../fragments/ChatHeader.vue'
import MessageList from '../fragments/MessagesList.vue'
import MessageInput from '../fragments/MessageInput.vue'
import { useConversationStore } from '@/stores/conversation'
import { computed } from 'vue'
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

const messages = computed(() => currentConversation.value?.messages.items || [])
const chatHeaderName = computed(() => {
  if (!currentConversation.value || currentConversation.value.members.length === 0)
    return ''

  if (currentConversation.value.members.length === 1)
    return currentConversation.value.members[0].name

  return currentConversation.value.members.map(m => m.name).join(', ')
})

const chatHeaderAvatarUrl = computed(() => {
  if (!currentConversation.value || currentConversation.value.members.length === 0)
    return ''

  return currentConversation.value.members[0].avatarUrl
})

const onInput = (input: string) => {
  if (!currentConversation.value)
    return

  conversationStore.sendTextMessage(currentConversation.value.id, input)
}

</script>

<template>
<div 
  v-if="currentConversation" 
  class="h-full flex flex-col shadow-md"
>
  <ChatHeader 
    :name="chatHeaderName"
    :avatar-url="chatHeaderAvatarUrl"
    :active-time="new Date()"
  />

  <MessageList 
    :messages="messages"
    :friend-name="chatHeaderName"
  />

  <MessageInput 
    @input="onInput"
  />
</div>
</template>

<style lang="postcss">

</style>
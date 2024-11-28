<script setup lang="ts">
import ChatHeader from '../fragments/ChatHeader.vue'
import MessageList from '../fragments/MessagesList.vue'
import MessageInput from '../fragments/MessageInput.vue'
import { useConversationStore } from '@/stores/conversation';
import { onMounted } from 'vue'
import { useUserProfileStore } from '@/stores/profile'
import { useRouter } from 'vue-router'

const router = useRouter()
const userProfileStore = useUserProfileStore()
const conversationStore = useConversationStore()

onMounted(async () => {
  // fetch conversation data
  await conversationStore.listConversations()
})

</script>

<template>
<div class="h-full flex flex-col">
  <ChatHeader 
    
  />

  <MessageList />

  <MessageInput />
</div>
</template>

<style lang="postcss">

</style>
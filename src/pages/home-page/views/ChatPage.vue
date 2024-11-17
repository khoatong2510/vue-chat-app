<script setup lang="ts">
import ChatHeader from '../fragments/ChatHeader.vue'
import MessageList from '../fragments/MessagesList.vue'
import MessageInput from '../fragments/MessageInput.vue'
import { useConversationStore } from '@/stores/conversation';

const conversationStore = useConversationStore()



</script>

<template>
<div class="h-full flex flex-col">
  <ChatHeader />

  <MessageList />

  <MessageInput />
</div>
</template>

<style lang="postcss">

</style>
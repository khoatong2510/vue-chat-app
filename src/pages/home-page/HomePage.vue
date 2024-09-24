<script setup lang="ts">
import ChatHeader from './fragments/ChatHeader.vue'
import MessageList from './fragments/MessagesList.vue'
import MessageInput from './fragments/MessageInput.vue'
import ContactsList from './fragments/ContactsList.vue'

</script>

<template>
  <ContactsList class="w-1/4 h-full" />

  <div class="
      w-3/4 h-full rounded-xl border border-solid 
      border-sky-100 shadow-lg bg-sky-100 bg-opacity-50 flex flex-col">
    <ChatHeader />

    <MessageList />

    <MessageInput />
  </div>
</template>

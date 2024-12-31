<script setup lang="ts">

import { useRouter } from 'vue-router'
import ContactsList from './fragments/ContactsList.vue'
import { onMounted } from 'vue'
import { useConversationStore } from '@/stores/conversation';
import { storeToRefs } from 'pinia';

const router = useRouter()
const conversationStore = useConversationStore()

onMounted(async () => {
  await conversationStore.listConversations()
  await conversationStore.listenMessageCreate()
})

const { conversations } = storeToRefs(conversationStore)

const onMessage = () => {
  router.push({ name: "chat" })
}

const onFriend = () => {
  router.push({ name: "friend" })
}

</script>

<template>
  <div class="w-full h-full flex items-center justify-center gap-4 p-4 bg-surfaceBright">
    <ContactsList 
      :conversations="conversations.items"
      class="w-1/4 h-full" 
      @message="onMessage"
      @friend="onFriend"
    />

    <div class="w-3/4 h-full rounded-xl">
      <RouterView />
    </div>
  </div>
</template>

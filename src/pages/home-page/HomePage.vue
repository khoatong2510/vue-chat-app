<script setup lang="ts">

import { useRouter } from 'vue-router'
import ContactsList from './fragments/ContactsList.vue'
import FriendPage from './views/FriendPage.vue'
import { ref } from 'vue'

const router = useRouter()
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
      class="w-1/4 h-full" 
      @message="onMessage"
      @friend="onFriend"
    />

    <div class="w-3/4 h-full rounded-xl">
      <RouterView />
    </div>
  </div>
</template>

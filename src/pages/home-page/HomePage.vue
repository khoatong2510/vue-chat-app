<script setup lang="ts">
import ChatHeader from './fragments/ChatHeader.vue'
import MessageList from './fragments/MessagesList.vue'
import MessageInput from './fragments/MessageInput.vue'
import ContactsList from './fragments/ContactsList.vue'
import FriendPage from './views/FriendPage.vue'
import { ref } from 'vue';

const isViewFriend = ref(false)

const onMessage = () => {
  isViewFriend.value = false
}

const onFriend = () => {
  isViewFriend.value = true
}


</script>

<template>
  <div class="w-full h-full flex items-center justify-center gap-4 p-4 bg-surfaceBright">

    <ContactsList 
      class="w-1/4 h-full" 
      @message="onMessage"
      @friend="onFriend"
    />


    <div class="
        w-3/4 h-full rounded-xl">
        <div v-if="!isViewFriend" class="h-full flex flex-col">
          <ChatHeader />
    
          <MessageList />
    
          <MessageInput />
        </div>

        <div v-else class="w-full h-full flex flex-col">
          <FriendPage
            class="w-full h-full"
          />

        </div>
    </div>


  </div>
</template>

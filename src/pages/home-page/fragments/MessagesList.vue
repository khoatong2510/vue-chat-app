<script setup lang="ts">
import MessageCard from './MessageCard.vue'
import type { Store } from '@/stores/types'

type MessagesListProps = {
  messages: Store.Message[],
  friendName: string
}

const props = defineProps<MessagesListProps>()

// some aggregation here

</script>

<template>
  <div 
    class="
      flex-1 flex flex-col p-4 gap-4 h-full overflow-y-auto
      bg-surfaceContainer 
    "
  >
    <template v-if="props.messages.length > 0">
      <MessageCard 
        v-for="message in props.messages"
        :key="message.id"
        v-bind="message"
      />
    </template>

    <p 
      v-else
      class="text-sm self-center italic text-outline"
    >
      You can start chat now, say "Hi" to {{ props.friendName }}
    </p>
  </div>
</template>

<style lang="postcss">

</style>
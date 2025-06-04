import { useConversationStore } from '@/stores/conversation'
import type { NavigationGuardNext, RouteLocation } from 'vue-router'

export const chatGuard = (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
  const conversationStore = useConversationStore()
  const id = to.params.id

  if (conversationStore.conversations.items.length === 0) {
    next()
  } else if (!id) {
    const firstConversation = conversationStore.conversations.items[0]
    next(`chat/${firstConversation.id}`)
  } else {
    next()
  }
}

import { defineStore } from 'pinia'
import type { Store } from './types'
import { useUserProfileStore } from './profile'
import conversationService from '@/services/conversation'
import type { Service } from '@/services/types'
import avatarService from '@/services/avatar'
import type { ID } from '@/types'

export const useConversationStore = defineStore('conversation', {
  state: (): Store.ConversationStoreState => {
    return {
      conversations: {
        items: [],
        cursor: null
      }
    }
  },
  actions: {
    async listConversations() {
      const userProfileStore = useUserProfileStore()
      const userProfile = userProfileStore.userProfile
      const friends = userProfileStore.friends

      if (!userProfile)
        throw Error("User profile not found")

      const userId = userProfile.id
      const res = await conversationService.listConversations(userId, this.conversations.cursor)

      // only handle for conversations having 2 members first
      // will handle for group later
      const promises = res.items.map(async (c: Service.Conversation) => {
        const [id] = c.members.filter(m => m !== userId)

        const friend = friends.find(f => f.id === id)

        if (!friend)
          throw Error(`Cannot find friend ${id}`)

        // const avatarUrl = await avatarService.fetchAvatarImage(id)

        return {
          ...c,
          name: friend.name,
          avatarUrl: friend.avatarUrl
        }
      })

      const items = await Promise.all(promises)

      this.conversations = {
        items,
        cursor: res.cursor
      }
    },
    async getConversationMessages(conversationId: ID) {
      const currentConversation = this.conversations.items.find(c => c.id === conversationId)
      if (!currentConversation)
        throw Error(`Conversation not found ${conversationId}`)

      const messages = await conversationService.getConversationMessages(conversationId, currentConversation.messages.cursor)

      currentConversation.messages.items = [...currentConversation.messages.items, ...messages.items]
      currentConversation.messages.cursor = messages.cursor
    }
  }
})

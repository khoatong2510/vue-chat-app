import { defineStore } from 'pinia'
import type { Store } from './types'
import { useUserProfileStore } from './profile'
import conversationService from '@/services/conversation'
import { Service } from '@/services/types'
import type { ID } from '@/types'
import type { FetchResult } from '@apollo/client'

export const useConversationStore = defineStore('conversation', {
  state: (): Store.ConversationStoreState => {
    return {
      conversations: {
        items: [] as Store.Conversation[],
        cursor: null
      },
      subscriptions: [] as Service.Subscription[]
    }
  },
  actions: {
    async listConversations(): Promise<void> {
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

        return {
          ...c,
          members: [friend],
        }
      })

      const items = await Promise.all(promises)

      this.conversations = {
        items,
        cursor: res.cursor
      }
    },
    async getConversationMessages(conversationId: ID): Promise<void> {
      const currentConversation = this.conversations.items.find(c => c.id === conversationId)
      if (!currentConversation)
        throw Error(`Conversation not found ${conversationId}`)

      const messages = await conversationService.getConversationMessages(conversationId, currentConversation.messages.cursor)

      currentConversation.messages.items = [...currentConversation.messages.items, ...messages.items]
      currentConversation.messages.cursor = messages.cursor
    },
    async sendTextMessage(conversationId: ID, content: string): Promise<void> {
      const currentConversationIndex = this.conversations.items.findIndex(c => c.id === conversationId)

      if (currentConversationIndex < 0)
        throw Error(`Conversation not found ${conversationId}`)

      const message = await conversationService.createMessage({
        conversationId, 
        content, 
        contentType: Service.MessageContentType.TEXT 
      })

      this.conversations.items.splice(currentConversationIndex, 1, {
        ...this.conversations.items[currentConversationIndex],
        lastMessage: message,
        messages: {
          ...this.conversations.items[currentConversationIndex].messages,
          items: [...this.conversations.items[currentConversationIndex].messages.items, message]
        }
      })
    },
    async listenMessageCreate(): Promise<void> {
      if (!this.conversations.items.length)
        return

      const promises = this.conversations.items.map(c =>  conversationService.onMessageCreated(c.id, this.handleMessageCreateSubscription))
      const subscriptions = await Promise.all(promises)

      this.subscriptions = subscriptions
    },
    async handleMessageCreateSubscription(value: FetchResult<{ onMessageCreated: Service.Message }>): Promise<void> {
      if (!value.data)
        return

      const message = value.data.onMessageCreated

      // update the conversation
      const conversationIndex = this.conversations.items.findIndex(c => c.id === message.conversationId)
      if (conversationIndex < 0)
        throw Error(`Conversation not found ${message.conversationId}`)

      this.conversations.items.splice(conversationIndex, 1, {
        ...this.conversations.items[conversationIndex],
        lastMessage: message,
        messages: {
          ...this.conversations.items[conversationIndex].messages,
          items: [...this.conversations.items[conversationIndex].messages.items, message]
        }
      })
    }
  }
})

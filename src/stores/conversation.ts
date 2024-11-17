import { defineStore } from 'pinia'
import type { Store } from './types'
import { useUserProfileStore } from './profile'

export const useConversationStore = defineStore('conversation', {
  state: (): Store.ConversationStoreState => {
    return {
      conversations: []
    }
  },
  actions: {
    listConversations: () => {

    }
  },
  getters: {
    emptyConversations: (state) => {
      const userProfileStore = useUserProfileStore()

      const userId = userProfileStore.userProfile?.id
      if (!userId)
        throw Error("User not found")

      const conversations = userProfileStore.acceptedFriends.map(friend => {
        const id = userId < friend.id ? `${userId}:${friend.id}` : `${friend.id}:${userId}`

        return {
          id,
          name: friend.name,
          avatarUrl: friend.avatarUrl,
          lastMessage: null,
          messages: null,
          createdAt: new Date()
        }
      })

      return conversations
    }
  }
})

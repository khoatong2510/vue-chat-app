import { defineStore } from 'pinia'
import type { Store } from './types'

export const useConversationStore = defineStore('conversation', {
  state: (): Store.ConversationStoreState => {
    return {
      conversations: []
    }
  },
  actions: {
    listConversations: () => {

    }
  }
})

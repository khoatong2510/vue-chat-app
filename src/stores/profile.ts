import { defineStore } from "pinia"
import userService from '@/services/user'
import { type Store } from './types'

interface UserProfileStoreState {
  id: string | null,
  name: string | null
  avatarUrl: string | null,
  suggestedFriends: Store.UserProfile[] | null
}

export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileStoreState => {
    return {
      id: null,
      name: null,
      avatarUrl: null,
      suggestedFriends: null
    }
  },
  actions: {
    async getUserProfile(userId: string): Promise<void> {
      const { id, name, avatarUrl } = await userService.getUser(userId)

      this.id = id
      this.name = name
      this.avatarUrl = avatarUrl
    },
    async createUserProfile(input: { id: string, name: string, avatarUrl: string }): Promise<void> {
      await userService.createUser(input)
    },
    async suggestFriend(): Promise<void> {
      if (!this.id)
        throw new Error("id not found")

      const res = await userService.suggestFriend(this.id)

      this.suggestedFriends = res.suggestFriend
    }
  }
})
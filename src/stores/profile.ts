import { defineStore } from "pinia"
import userService from '@/services/user'
import { type Store } from './types'
import authService from '@/services/amplify-auth'
import { toBase64 } from "@/utils"

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
      const userProfile = await userService.getUser(userId)

      if (!userProfile)
        return

      const { id, name, avatarUrl } = userProfile

      this.id = id
      this.name = name

      const idToken = await authService.currentIdToken()

      const res = await fetch(avatarUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
          Accept: 'image/*',
        }
      })

      const blob = await res.blob()
      const url = await toBase64(blob)
      this.avatarUrl = url
    },
    async createUserProfile(input: { name: string, avatarUrl: string }): Promise<void> {
      await userService.createUser(input)
    },
    async suggestFriend(): Promise<void> {
      if (!this.id)
        throw new Error("id not found")

      const res = await userService.suggestFriend(this.id)
      const idToken = await authService.currentIdToken()

      this.suggestedFriends = await Promise.all(res.suggestFriend.map(async (friend) => {
        const res = await fetch(`https://2v2dwfsmk4.execute-api.ap-southeast-2.amazonaws.com/dev/avatar/${friend.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
            Accept: 'image/*',
          }
        })

        const blob = await res.blob()
        let url = await toBase64(blob)

        return {
          ...friend,
          avatarUrl: url
        }
      }))
    },
    async requestFriend(id: string): Promise<void> {
      await userService.requestFriend(id)
    }
  }
})
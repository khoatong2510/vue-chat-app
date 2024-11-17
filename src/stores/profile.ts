import { defineStore } from "pinia"
import userService from '@/services/user'
import { type Store } from './types'
import authService from '@/services/amplify-auth'
import { toBase64 } from "@/utils"
import { Service } from '@/services/types'
import avatarService from '@/services/avatar'
import type { FetchResult } from "@apollo/client"
import type { ID } from "@/types"
import { useConversationStore } from "./conversation"

interface UserProfileStoreState {
  userProfile: Store.UserProfile | null
  suggestedFriends: Store.UserProfile[]
  subscriptions: Service.Subscription[]
  friends: Array<Store.UserProfile & { status: Service.FriendStatus, sentBy: ID }>
}

export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileStoreState => {
    return {
      userProfile: null,
      suggestedFriends: [],
      subscriptions: [],
      friends: []
    }
  },
  getters: {
    friendRequests: (state) =>
      state.friends.filter(f => f.status === Service.FriendStatus.REQUESTED && f.sentBy !== state.userProfile?.id),

    acceptedFriends: (state) =>
      state.friends.filter(friend => friend.status === Service.FriendStatus.ACCEPTED)
  },
  actions: {
    async getUserProfile(userId: string): Promise<void> {
      console.log(userId)
      const userProfile = await userService.getUser(userId)
      console.log(userProfile)

      if (!userProfile)
        return

      const idToken = await authService.currentIdToken()
      const url = await avatarService.fetchAvatarImage(userId, idToken)

      this.userProfile = {
        ...userProfile,
        avatarUrl: url
      }

      const friends = await Promise.all(userProfile.friends.map(async (friend) => {
        const friendProfile = await userService.getUser(friend.id)

        if (!friendProfile)
          throw Error(`Friend profile not found ${friend.id}`)

        const friendAvatarUrl = await avatarService.fetchAvatarImage(friend.id, idToken)

        return {
          id: friendProfile.id,
          name: friendProfile?.name,
          avatarUrl: friendAvatarUrl,
          status: friend.status,
          sentBy: friend.sentBy
        }
      }))

      this.friends = friends

    },
    async createUserProfile(input: { name: string, avatarUrl: string }): Promise<void> {
      await userService.createUser(input)
    },
    async suggestFriend(): Promise<void> {
      if (!this.userProfile)
        throw new Error("id not found")

      const res = await userService.suggestFriend(this.userProfile.id)
      const idToken = await authService.currentIdToken()

      this.suggestedFriends = await Promise.all(res.suggestFriend.map(async (friend: Store.UserProfile) => {
        const url = await avatarService.fetchAvatarImage(friend.id, idToken)

        return {
          ...friend,
          avatarUrl: url
        }
      }))

      console.log("suggested friends", this.suggestedFriends)

    },
    async requestFriend(id: string): Promise<void> {
      await userService.requestFriend(id)

      this.suggestedFriends = this.suggestedFriends.filter(f => f.id !== id)

    },

    async listenFriendRequest(): Promise<void> {
      if (!this.userProfile)
        return

      const subscription = await userService.onFriendRequested(this.userProfile.id, this.handleFriendRequestSubscription)
      this.subscriptions.push(subscription)
    },

    async reset() {
      this.userProfile = null
      this.suggestedFriends = []

      for (const sub of this.subscriptions) {
        sub.unsubscribe()
      }

      this.subscriptions = []
      this.friends = []
    },
    async handleFriendRequestSubscription(value: FetchResult<{ onFriendRequested: { from: ID, to: ID } }>): Promise<void> {
      if (!value.data)
        return

      const { from } = value.data.onFriendRequested
      const requestedUser = await userService.getUser(from)
      const idToken = await authService.currentIdToken()

      if (!requestedUser)
        throw Error("Requested User not found")

      const url = await avatarService.fetchAvatarImage(requestedUser.id, idToken)

      this.friends.push({
        ...requestedUser,
        avatarUrl: url,
        status: Service.FriendStatus.REQUESTED,
        sentBy: from
      })
    },

    async acceptFriendRequest(id: ID): Promise<void> {
      await userService.acceptFriend(id)

      const friendIndex = this.friends.findIndex(f => f.id === id)

      if (friendIndex < 0)
        throw Error("Friend not found")

      const updatedFriend = {
        ...this.friends[friendIndex],
        status: Service.FriendStatus.ACCEPTED
      }

      this.friends.splice(friendIndex, 1, updatedFriend)
    },
    async rejectFriendRequest(id: ID): Promise<void> {
      await userService.rejectFriend(id)

      const friendIndex = this.friends.findIndex(f => f.id === id)

      if (friendIndex < 0)
        throw Error("Friend not found")

      this.friends.splice(friendIndex, 1)
    }
  }
})
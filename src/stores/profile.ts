import { defineStore } from "pinia"
import userService from '@/services/user'
import { type Store } from './types'
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
      const userProfile = await userService.getUser(userId)

      if (!userProfile)
        return

      const url = await avatarService.fetchAvatarImage(userId)

      this.userProfile = {
        ...userProfile,
        avatarUrl: url
      }

      const friends = await Promise.all(userProfile.friends.map(async (friend) => {
        const friendProfile = await userService.getUser(friend.id)

        if (!friendProfile)
          throw Error(`Friend profile not found ${friend.id}`)

        const friendAvatarUrl = await avatarService.fetchAvatarImage(friend.id)

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

      this.suggestedFriends = await Promise.all(res.suggestFriend.map(async (friend: Store.UserProfile) => {
        const url = await avatarService.fetchAvatarImage(friend.id)

        return {
          ...friend,
          avatarUrl: url
        }
      }))
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

    async listenFriendAccept(): Promise<void> {
      if (!this.userProfile)
        return

      const subscription = await userService.onFriendAccepted(this.userProfile.id, this.handleFriendAcceptedSubscription)
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

      if (!requestedUser)
        throw Error("Requested User not found")

      const url = await avatarService.fetchAvatarImage(requestedUser.id)

      this.friends.push({
        ...requestedUser,
        avatarUrl: url,
        status: Service.FriendStatus.REQUESTED,
        sentBy: from
      })
    },
    async handleFriendAcceptedSubscription(value: FetchResult<{ onFriendAccepted: { from: ID, to: ID } }>): Promise<void> {
      if (!value.data)
        return

      const { from } = value.data.onFriendAccepted

      const acceptedFriendIndex = this.friends.findIndex(f => f.id === from)

      if (acceptedFriendIndex >= 0) {
        // update status
        const acceptedFriend = this.friends[acceptedFriendIndex]
        this.friends.splice(acceptedFriendIndex, 1, {
          ...acceptedFriend,
          status: Service.FriendStatus.ACCEPTED
        })
      } else {
        const acceptedFriend = await userService.getUser(from)

        if (!acceptedFriend)
          throw Error("Requested User not found")

        const url = await avatarService.fetchAvatarImage(acceptedFriend.id)

        this.friends.push({
          ...acceptedFriend,
          avatarUrl: url,
          status: Service.FriendStatus.ACCEPTED,
          sentBy: from
        })

        const conversationStore = useConversationStore()
        await conversationStore.listConversations()
      }
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
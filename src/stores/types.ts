import type { CursorPaged, ID } from "@/types"

export namespace Store {
  export interface AuthStoreState {
    user: AuthStoreUser | null
    hasValidSession: boolean
  }

  export type AuthStoreUser = {
    userId: ID
    username: string
  }

  export type UserProfile = {
    id: ID
    name: string
    avatarUrl: string
  }

  export type Message = {
    content: string
    createdAt: Date
    sentBy: ID
  }

  export type Conversation = {
    id: ID
    name: string
    avatarUrl: string
    lastMessage: Message | null
    messages: CursorPaged<Message>
    createdAt: Date
  }

  export interface ConversationStoreState {
    conversations: CursorPaged<Conversation>
  }
}



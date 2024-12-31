import type { CursorPaged, ID } from "@/types"

export namespace Service {
  export type AuthInput = {
    email: string
    password: string
  }

  export type CreateUserInput = {
    name: string
    avatarUrl: string
  }

  export enum FriendStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    BLOCKED = 'BLOCKED'
  }

  export enum MessageContentType {
    TEXT = 'TEXT',
    MEDIA = 'MEDIA',
    REACTION = 'REACTION'
  }

  export type Friend = {
    id: string,
    sentBy: string,
    status: FriendStatus
  }

  export type User = {
    id: string
    name: string
    avatarUrl: string,
    friends: Friend[]
  }

  export type Subscription = {
    unsubscribe: Function
  }

  export type Message = {
    id: ID
    conversationId: ID
    content: string
    contentType: MessageContentType
    sentBy: ID
    replyTo: ID
    createdAt: Date
    updatedAt: Date
  }

  export type Conversation = {
    id: ID
    members: ID[]
    lastMessage: Message | null
    messages: CursorPaged<Message>
    createdAt: Date
  }
}
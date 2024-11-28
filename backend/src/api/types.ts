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
  id: ID
  // userId: ID
  sentBy: ID
  status: FriendStatus
}

export type User = {
  id: ID
  name: string
  avatarUrl: string,
  friends?: Friend[]
}

export type CreateUserArgs = Pick<User, "name" | "avatarUrl">

export type Result = {
  success: boolean
  error?: string
}

export type Message = {
  id: ID
  conversationId: ID
  createdAt: Date
  updatedAt?: Date
  sentBy: ID
  content: string
  contentType: MessageContentType
  replyTo?: ID
}

export type Conversation = {
  id: ID
  lastMessage?: Message
  members?: ID[]
}

export type ID = string
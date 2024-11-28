import { Friend, User } from "../types"

export enum DynamoDbGSI {
  RERVERSE_INDEX = 'reverse-index'
}

export enum DynamoDbLSI {
  MESSAGE_BY_CREATEDAT = 'message-by-createdAt-lsi'
}

export type UserUpdateArgs = Partial<Omit<User, 'id' | 'friends'>>
export type FriendUpdateArgs = Partial<Omit<Friend, 'id'>>

export type CursorPaged<T> = {
  items: T[]
  cursor?: string
}


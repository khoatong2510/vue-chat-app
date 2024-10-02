export enum FriendStatus {
  REQUESTED,
  ACCEPTED,
  BLOCKED
}

type Friend = {
  id: string,
  status: FriendStatus
}

export type User = {
  id: ID
  name: string
  avatarUrl: string,
  friends?: Friend[]
}

export type CreateUserArgs = {
  name: string
  avatarUrl: string
}

export type Result = {
  success: boolean
  error?: string
}

export type ID = string
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

export type ID = string
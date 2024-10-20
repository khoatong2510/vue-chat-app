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
}
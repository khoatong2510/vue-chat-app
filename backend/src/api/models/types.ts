import { Friend, FriendStatus, ID, User } from "../controllers/types";

namespace Model {
  export type UserUpdateArgs = Partial<Omit<User, 'id' | 'friends'>>
  export type FriendUpdateArgs = Partial<Omit<Friend, 'id'>>

  export type User = {
    id: ID
    name: string
    avatarUrl: string
    friends: {
      [id: string]: {
        sentBy: string,
        status: FriendStatus
      }
    }
  }

  export type Message = {
    id: ID
    createdAt: Date
    content: string
    sentBy: ID
  }

  export type CursorPaged<T> = {
    items: T[]
    cursor?: string
  }
}

export default Model
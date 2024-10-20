import { FriendStatus, ID, User } from "../controllers/types";

namespace Model {
  export type UserUpdateArgs = Partial<Omit<User, 'id' | 'friends'>>

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
}

export default Model
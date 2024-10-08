import { User } from "../controllers/types";

namespace Model {
  export type UserUpdateArgs = Partial<Omit<User, 'id' | 'friends'>>
}

export default Model
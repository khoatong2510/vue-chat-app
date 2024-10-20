import type { ID } from "@/types"

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
}



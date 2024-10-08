export namespace Service {
  export type AuthInput = {
    email: string
    password: string
  }

  export type CreateUserInput = {
    name: string
    avatarUrl: string
  }

  export type User = {
    id: string
    name: string
    avatarUrl: string
  }
}
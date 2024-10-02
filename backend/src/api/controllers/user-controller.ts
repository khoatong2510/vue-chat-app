import { CreateUserArgs, ID, Result, User } from "./types"
import { DbContext, UserContext } from "../lambda/types"
import UserModel from "../models/user-model"

const USER_TABLE_NAME = "UserTable" as const

const listUsers = (dbContext: DbContext, userContext: UserContext) => async (): Promise<User[]> => {
  try {
    const users = await UserModel.listUsers(dbContext)()
    return users

  } catch (error) {
    throw error
  }
}

const getUser = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: string }): Promise<User | undefined> => {
  try {

    const user = await UserModel.getUser(dbContext)(id)
    return user
  } catch (error) {
    throw error
  }
}

const suggestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: string }): Promise<ID[]> => {
  try {
    const userId = userContext.id
    const user = await UserModel.getUser(dbContext)(userId)

    if (!user)
      throw Error(`User profile not found ${userId}`)

    const friendIds = (user.friends || []).map(f => f.id)

    const friendSuggestionIds = await UserModel.getFriendSuggestion(dbContext)(userId, friendIds)

    return friendSuggestionIds
  } catch (error) {
    throw error
  }
}

const createUser = (dbContext: DbContext, userContext: UserContext) => async (args: { input: CreateUserArgs }): Promise<Result> => {
  // args validation
  const userId = userContext.id
  const { name, avatarUrl } = args.input

  if (name === '')
    throw Error(`Invalid name value ${name}`)

  if (avatarUrl === '')
    throw Error(`Invalid avatarUrl value ${avatarUrl}`)

  try {
    const user = await UserModel.getUser(dbContext)(userId)

    if (user)
      throw Error(`User is already exists`)

    await UserModel.createUser(dbContext)({
      id: userId,
      name,
      avatarUrl
    })

    return {
      success: true
    }
  } catch (error) {
    throw error
  }
}

export default {
  listUsers,
  getUser,
  suggestFriend,
  createUser
}
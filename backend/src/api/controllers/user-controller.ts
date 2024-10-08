import { CreateUserArgs, FriendStatus, ID, Result, User } from "./types"
import { DbContext, UserContext } from "../lambda/types"
import UserModel from "../models/user-model"
import userModel from "../models/user-model"

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

const suggestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: string }): Promise<User[]> => {
  try {
    const user = await UserModel.getUser(dbContext)(id)

    if (!user)
      throw Error(`User profile not found ${id}`)

    const friendIds = (user.friends || []).map(f => f.id)

    const friendSuggestionIds = await UserModel.getFriendSuggestion(dbContext)(id, friendIds)

    return friendSuggestionIds
  } catch (error) {
    throw error
  }
}

const requestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: string }): Promise<ID> => {
  try {
    const userId = userContext.id
    const user = await UserModel.getUser(dbContext)(userId)

    if (!user)
      throw Error(`User profile not found ${userId}`)

    const friend = await UserModel.getUser(dbContext)(id)

    if (!friend)
      throw Error(`Requested friend profile not found ${friend}`)

    const userFriends = user.friends || []

    if (userFriends.length > 0) {
      const friend = userFriends.find(f => f.id === id)

      if (friend) {
        switch (friend.status) {
          case FriendStatus.BLOCKED:
            throw Error(`User is blocked`)
          case FriendStatus.ACCEPTED:
            throw Error(`User ${id} is already in friends list`)
          case FriendStatus.REQUESTED:
            throw Error(`Friend request still pending`)
          default:
            throw Error(`Invalid friend request from ${userId} to ${id}`)
        }
      }
    }

    // save record to requesting A, return result
    const requesting = {
      id,
      status: FriendStatus.REQUESTED
    }

    const friendId = await userModel.addToFriendList(dbContext)(userId, requesting)

    // save record to requested B
    const requested = {
      id: userId,
      status: FriendStatus.REQUESTED
    }

    await userModel.addToFriendList(dbContext)(id, requested)

    return friendId
  } catch (error) {
    throw error
  }
}

export default {
  listUsers,
  getUser,
  createUser,
  suggestFriend,
  requestFriend
}
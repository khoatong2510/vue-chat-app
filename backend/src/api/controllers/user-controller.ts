import { CreateUserArgs, Friend, FriendStatus, ID, Result, User } from "./types"
import { DbContext, UserContext } from "../lambda/types"
import UserModel from "../models/user-model"
import userModel from "../models/user-model"

const listUsers = (dbContext: DbContext, userContext: UserContext) => async (): Promise<User[]> => {
  try {
    const users = await UserModel.listUsers(dbContext)()
    return users

  } catch (error) {
    throw error
  }
}

const getUser = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<User | undefined> => {
  try {
    const user = await UserModel.getUser(dbContext)(id)

    if (!user)
      throw Error("User not found")

    let friends = Object.entries(user.friends || {}).reduce((a: Friend[], [key, values]) => {
      return [...a, {
        id: key,
        ...values
      }]
    }, [])

    return {
      ...user,
      friends
    }
  } catch (error) {
    console.error("getUser error", error)
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

const suggestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<User[]> => {
  try {
    const user = await UserModel.getUser(dbContext)(id)

    if (!user)
      throw Error(`User profile not found ${id}`)

    const friendIds = Object.keys(user.friends || {})

    const friendSuggestionIds = await UserModel.getFriendSuggestion(dbContext)(id, friendIds)

    return friendSuggestionIds
  } catch (error) {
    throw error
  }
}

const requestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  try {
    const userId = userContext.id
    const user = await UserModel.getUser(dbContext)(userId)

    if (!user)
      throw Error(`User profile not found ${userId}`)

    const friend = await UserModel.getUser(dbContext)(id)

    if (!friend)
      throw Error(`Requested friend profile not found ${friend}`)

    const userFriends = Object.keys(user.friends || {})


    if (userFriends.length > 0) {
      const fid = userFriends.find(fid => fid === id)

      if (fid) {
        const status = user.friends[fid].status

        switch (status) {
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

    if (userFriends.length === 0) {
      await userModel.initUserFriend(dbContext)(userId)
    }

    if (Object.keys(friend.friends || {}).length === 0) {
      await userModel.initUserFriend(dbContext)(friend.id)
    }

    // save record to requesting A, return result
    const requesting = {
      sentBy: userId,
      status: FriendStatus.REQUESTED
    }

    const friendId = await userModel.updateUserFriend(dbContext)(userId, id, requesting)

    await userModel.updateUserFriend(dbContext)(id, userId, requesting)

    return {
      from: userId,
      to: friendId
    }

  } catch (error) {
    throw error
  }
}

const acceptFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<Result> => {
  try {
    const userId = userContext.id
    const friendId = id
    const user = await userModel.getUser(dbContext)(userId)

    if (!user)
      throw Error("User not found")

    if (!user.friends[friendId])
      throw Error(`Friend not found ${friendId}`)

    if (user.friends[friendId].status !== FriendStatus.REQUESTED)
      throw Error("invalid friend status")

    const sentBy = user.friends[friendId].sentBy

    await Promise.all([
      userModel.updateUserFriend(dbContext)(userId, friendId, {
        sentBy,
        status: FriendStatus.ACCEPTED
      }),
      userModel.updateUserFriend(dbContext)(friendId, userId, {
        sentBy,
        status: FriendStatus.ACCEPTED
      })
    ])

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error)
    }
  }
}

const rejectFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<Result> => {
  try {
    const userId = userContext.id
    const friendId = id
    const user = await userModel.getUser(dbContext)(userId)

    if (!user)
      throw Error(`User not found ${userId}`)

    if (!user.friends[friendId])
      throw Error(`Friend not found ${friendId}`)

    if (user.friends[friendId].status !== FriendStatus.REQUESTED)
      throw Error("invalid friend status")

    await Promise.all([
      userModel.deleteUserFriend(dbContext)(userId, friendId),
      userModel.deleteUserFriend(dbContext)(friendId, userId)
    ])

    return {
      success: true
    }
  } catch (error) {
    throw error
  }
}

const blockFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<Result> => {
  try {
    const userId = userContext.id
    const friendId = id

    const user = await userModel.getUser(dbContext)(userId)

    if (!user)
      throw Error(`User not found ${userId}`)

    if (!user.friends[friendId])
      throw Error(`Friend not found ${friendId}`)


    const sentBy = user.friends[friendId].sentBy
    await Promise.all([
      userModel.updateUserFriend(dbContext)(userId, id, {
        sentBy,
        status: FriendStatus.BLOCKED
      }),
      userModel.updateUserFriend(dbContext)(id, userId, {
        sentBy,
        status: FriendStatus.BLOCKED
      })
    ])

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
  createUser,
  suggestFriend,
  requestFriend,
  acceptFriend,
  rejectFriend,
  blockFriend
}
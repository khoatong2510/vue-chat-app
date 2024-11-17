import { CreateUserArgs, Friend, FriendStatus, ID, Result, User } from "./types"
import { DbContext, UserContext } from "../lambda/types"
import { v4 as uuidv4 } from "uuid"
import userModel from "../models/user-model"
import chatModel from "../models/chat-model"

const getUser = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<User | undefined> => {
  const user = await userModel.getUser(dbContext)(id)
  if (!user)
    return undefined

  const friends = await userModel.listFriendsByUserId(dbContext)(id)

  return {
    ...user,
    friends
  }
}

const createUser = (dbContext: DbContext, userContext: UserContext) => async (args: { input: CreateUserArgs }): Promise<Result> => {
  // args validation
  const utcNow = new Date()
  const userId = userContext.id
  const { name, avatarUrl } = args.input

  if (name === '')
    throw Error(`Invalid name value ${name}`)

  if (avatarUrl === '')
    throw Error(`Invalid avatarUrl value ${avatarUrl}`)

  const user = await userModel.getUser(dbContext)(userId)

  if (user)
    throw Error(`User is already exists`)

  await userModel.createUser(dbContext)({
    id: userId,
    name,
    avatarUrl
  }, utcNow)

  return {
    success: true
  }
}

const suggestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<User[]> => {
  const user = await userModel.getUser(dbContext)(id)

  if (!user)
    throw Error(`User profile not found ${id}`)

  const SUGGEST_LIMIT = 5
  // fetch all friends
  const friends = await userModel.listFriendsByUserId(dbContext)(id)
  const unwantedIds = [friends.map(f => f.id), id]

  const userPage = await userModel.listUsers(dbContext)()

  let suggestions = userPage.items.filter(u => unwantedIds.includes(u.id))

  while (suggestions.length < SUGGEST_LIMIT) {
    const nextPage = await userModel.listUsers(dbContext)(userPage.cursor)
    suggestions = [...suggestions, ...nextPage.items.filter(u => unwantedIds.includes(u.id))]
  }

  return suggestions
}

const requestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  const userId = userContext.id
  const user = await userModel.getUser(dbContext)(userId)

  if (!user)
    throw Error(`User profile not found ${userId}`)

  const friend = await userModel.getUser(dbContext)(id)

  if (!friend)
    throw Error(`Requested friend profile not found ${friend}`)

  await userModel.createFriend(dbContext)(userId, id, FriendStatus.REQUESTED, userId)
  await userModel.createFriend(dbContext)(id, userId, FriendStatus.REQUESTED, userId)

  return {
    from: userId,
    to: id
  }
}

const acceptFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<Result> => {
  const utcNow = new Date()
  const userId = userContext.id
  const friendId = id
  const user = await userModel.getUser(dbContext)(userId)

  if (!user)
    throw Error("User not found")

  await userModel.updateFriend(dbContext)(userId, friendId, { status: FriendStatus.ACCEPTED })
  await userModel.updateFriend(dbContext)(friendId, userId, { status: FriendStatus.ACCEPTED })

  const conversationId = uuidv4()
  await chatModel.createConversation(dbContext)(conversationId, [userId, friendId], utcNow)

  return {
    success: true
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
  getUser,
  createUser,
  suggestFriend,
  requestFriend,
  acceptFriend,
  rejectFriend,
  blockFriend
}
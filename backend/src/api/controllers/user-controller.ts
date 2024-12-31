import { DbContext, UserContext } from "../lambda/types"
import { v4 as uuidv4 } from "uuid"
import userModel from "../models/user-model"
import chatModel from "../models/chat-model"
import type { CreateUserArgs, ID, Result, User } from "../types"
import { FriendStatus } from "../types"

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
  const unwantedIds = [...friends.map(f => f.id), id]

  const userPage = await userModel.listUsers(dbContext)()
  let suggestions = userPage.items.filter(u => !unwantedIds.includes(u.id))

  if (!userPage.cursor)
    return suggestions

  if (suggestions.length > SUGGEST_LIMIT)
    return suggestions.slice(0, SUGGEST_LIMIT)

  while (suggestions.length < SUGGEST_LIMIT) {
    const nextPage = await userModel.listUsers(dbContext)(userPage.cursor)
    const nextSuggestion = nextPage.items.filter(u => !unwantedIds.includes(u.id))

    const remaining = SUGGEST_LIMIT - suggestions.length

    if (remaining > nextSuggestion.length)
      suggestions = [...suggestions, ...nextSuggestion]
    else
      suggestions = [...suggestions, ...nextSuggestion.slice(0, remaining)]
  }

  return suggestions
}

const requestFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  const userId = userContext.id
  const friendId = id

  const user = await userModel.getUser(dbContext)(userId)
  const friend = await userModel.getUser(dbContext)(friendId)

  if (!user)
    throw Error(`User profile not found ${userId}`)

  if (!friend)
    throw Error(`Requested friend profile not found ${friend}`)

  // check if they have already been friend
  const [fr1, fr2] = await Promise.all([
    userModel.getFriend(dbContext)(userId, friendId),
    userModel.getFriend(dbContext)(friendId, userId)
  ])

  if (fr1 || fr2)
    throw Error(`Users are already friends ${userId}, ${friendId}`)

  // check if they have 1-1 conversation together
  const cIdsA = await chatModel.listConversationsByUserId(dbContext)(userId)
  
  if (cIdsA.items.length > 0)
    throw Error(`Conversation already exists between users: ${userId}, ${friendId}`)

  await userModel.createFriend(dbContext)(userId, id, FriendStatus.REQUESTED, userId)
  await userModel.createFriend(dbContext)(id, userId, FriendStatus.REQUESTED, userId)

  return {
    from: userId,
    to: id
  }
}

const acceptFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  const utcNow = new Date()
  const userId = userContext.id
  const friendId = id

  const user = await userModel.getUser(dbContext)(userId)
  const friend = await userModel.getUser(dbContext)(friendId)

  if (!user)
    throw Error(`User not found ${userId}`)

  if (!friend)
    throw Error(`Friend not found ${friendId}`)

  const [fr1, fr2] = await Promise.all([
    userModel.getFriend(dbContext)(userId, friendId),
    userModel.getFriend(dbContext)(friendId, userId)
  ])

  if (!fr1 || !fr2)
    throw Error(`Friend request not found between users: ${userId}, ${friendId}`)

  if (fr1.status !== FriendStatus.REQUESTED || fr2.status !== FriendStatus.REQUESTED)
    throw Error(`Invalid Friend status`)

  await Promise.all([
    userModel.updateFriend(dbContext)(userId, friendId, { status: FriendStatus.ACCEPTED }),
    userModel.updateFriend(dbContext)(friendId, userId, { status: FriendStatus.ACCEPTED })
  ])

  const conversationId = uuidv4()
  await chatModel.createConversation(dbContext)(conversationId, [userId, friendId], utcNow)

  return {
    from: userId,
    to: friendId
  }
}

const rejectFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  const userId = userContext.id
  const friendId = id

  const user = await userModel.getUser(dbContext)(userId)
  const friend = await userModel.getUser(dbContext)(friendId)

  if (!user)
    throw Error(`User not found ${userId}`)

  if (!friend)
    throw Error(`User not found ${friendId}`)

  const friendRequestA = await userModel.getFriend(dbContext)(userId, friendId)
  const friendRequestB = await userModel.getFriend(dbContext)(friendId, userId)

  if (!friendRequestA || !friendRequestB)
    throw Error(`Friend request not found between users: ${userId}, ${friendId}`)

  if (friendRequestA.status !== FriendStatus.REQUESTED || friendRequestB.status !== FriendStatus.REQUESTED)
    throw Error("Invalid friend status")

  await Promise.all([
    userModel.deleteFriend(dbContext)(userId, friendId),
    userModel.deleteFriend(dbContext)(friendId, userId)
  ])

  return {
    from: userId,
    to: friendId
  }
}

const blockFriend = (dbContext: DbContext, userContext: UserContext) => async ({ id }: { id: ID }): Promise<{ from: ID, to: ID }> => {
  const userId = userContext.id
  const friendId = id

  const user = await userModel.getUser(dbContext)(userId)
  const friend = await userModel.getUser(dbContext)(friendId)

  if (!user)
    throw Error(`User not found ${userId}`)

  if (!friend)
    throw Error(`User not found ${friendId}`)

  const friendDataA = await userModel.getFriend(dbContext)(userId, friendId)
  const friendDataB = await userModel.getFriend(dbContext)(friendId, userId)

  if (!friendDataA || !friendDataB)
    throw Error(`Friend request not found between users: ${userId}, ${friendId}`)

  if (friendDataA.status !== FriendStatus.REQUESTED || friendDataB.status !== FriendStatus.REQUESTED)
    throw Error("Invalid friend status")

  await Promise.all([
    userModel.updateFriend(dbContext)(userId, id, { status: FriendStatus.BLOCKED }),
    userModel.updateFriend(dbContext)(id, userId, { status: FriendStatus.BLOCKED })
  ])

  return {
    from: userId,
    to: friendId
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
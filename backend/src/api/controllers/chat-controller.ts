import { DbContext, UserContext } from "../lambda/types"
import userModel from "../models/user-model"
import chatModel from "../models/chat-model"
import { Conversation, ID, Message, Result } from "../types"
import { CursorPaged } from "../models/types"
import { v4 as uuid } from 'uuid'

const listConversations = (dbContext: DbContext, userContext: UserContext) => async ({ userId, cursor }: { userId: ID, cursor?: string }): Promise<CursorPaged<Conversation>> => {
  const user = await userModel.getUser(dbContext)(userId)

  if (!user)
    throw Error(`User not found ${userId}`)

  const res = await chatModel.listConversationsByUserId(dbContext)(userId, cursor)

  const promises = res.items.map(async (c) => {
    const members = await chatModel.listMembersByConversationId(dbContext)(c.id)
    const lastMessage = await chatModel.getConversationLastMessage(dbContext)(c.id)
    const messages = await chatModel.listMessagesByConversationId(dbContext)(c.id)

    return {
      ...c,
      members,
      messages,
      lastMessage
    }
  })

  const conversations = await Promise.all(promises)

  return {
    items: conversations,
    cursor: res.cursor
  }
}

const getConversationMessages = (dbContext: DbContext, userContext: UserContext) => async ({ conversationId, cursor }: { conversationId: ID, cursor?: string }): Promise<CursorPaged<Message>> => {
  const userId = userContext.id
  const conversationMember = await chatModel.getConversationMember(dbContext)(conversationId, userId)

  if (!conversationMember)
    throw Error(`Cannot find member: ${userId} of conversation: ${conversationId}`)

  const res = await chatModel.listMessagesByConversationId(dbContext)(conversationId, cursor)
  return res
}

const createMessage = (dbContext: DbContext, userContext: UserContext) => async ({ input } : { input : Pick<Message, "content" | "contentType" | "conversationId"> }): Promise<Message> => {
  const utcNow = new Date()
  // validate user
  const userId = userContext.id
  const user = await userModel.getUser(dbContext)(userId)
  const { conversationId, content, contentType } = input

  if (!user)
    throw Error(`User not found ${userId}`)

  const conversation = await chatModel.getConversationMember(dbContext)(conversationId, userId)

  if (!conversation)
    throw Error(`Conversation not found ${conversationId}, ${userId}`)

  // validate input
  if (content === '')
    throw Error("message content cannot be empty")

  const message = {
    id: uuid(),
    content: content,
    contentType: contentType,
    sentBy: userId,
    createdAt: utcNow
  }

  await chatModel.createMessage(dbContext)(conversationId, message)

  return {
    ...message,
    conversationId
  }
}

const updateMessage = (dbContext: DbContext, userContext: UserContext) => async () => {

}

export default {
  getConversationMessages,
  listConversations,
  createMessage,
  updateMessage
}
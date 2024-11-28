import { DbContext, UserContext } from "../lambda/types"
import userModel from "../models/user-model"
import chatModel from "../models/chat-model"
import { Conversation, ID, Message } from "../types"
import { CursorPaged } from "../models/types"
import { v4 as uuid } from 'uuid'

const listConversations = (dbContext: DbContext, userContext: UserContext) => async (userId: ID, cursor?: string): Promise<CursorPaged<Conversation>> => {
  const user = await userModel.getUser(dbContext)(userId)
  if (!user)
    throw Error("User not found")

  const res = await chatModel.listConversationIdsByUserId(dbContext)(userId)

  const promises = res.items.map(async (id) => {
    const members = await chatModel.listMembersByConversationId(dbContext)(id)
    const lastMessage = await chatModel.getConversationLastMessage(dbContext)(id)

    return {
      id,
      members,
      lastMessage
    }
  })

  const conversations = await Promise.all(promises)

  return {
    items: conversations,
    cursor: res.cursor
  }
}

const getConversationMessages = (dbContext: DbContext, userContext: UserContext) => async (conversationId: ID): Promise<CursorPaged<Message>> => {
  const userId = userContext.id
  const conversationMember = await chatModel.getConversationMember(dbContext)(conversationId, userId)

  if (!conversationMember)
    throw Error(`Cannot find member: ${userId} of conversation: ${conversationId}`)

  const res = await chatModel.listMessagesByConversationId(dbContext)(conversationId)
  return res
}

const createMessage = (dbContext: DbContext, userContext: UserContext) => async (conversationId: ID, value: Pick<Message, "content" | "contentType">) => {
  const utcNow = new Date()
  // validate user
  const userId = userContext.id
  const user = await userModel.getUser(dbContext)(userId)

  if (!user)
    throw Error("User not found")

  const conversation = await chatModel.getConversationMember(dbContext)(conversationId, userId)

  if (!conversation)
    throw Error("Conversation not found")

  // validate input
  if (value.content === '')
    throw Error("message content cannot be empty")

  await chatModel.createMessage(dbContext)(conversationId, {
    id: uuid(),
    content: value.content,
    contentType: value.contentType,
    sentBy: userId,
    createdAt: utcNow
  })
}

const updateMessage = (dbContext: DbContext, userContext: UserContext) => async () => {

}

export default {
  getConversationMessages,
  listConversations,
  createMessage,
  updateMessage
}
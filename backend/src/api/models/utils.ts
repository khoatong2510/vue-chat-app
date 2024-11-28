import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { Conversation, Friend, Message, User } from '../types'

export const DYNAMODB_READ_LIMIT = 200
enum PartitionKeyPrefix {
  USER = 'u',
  CONVERSATION = 'c',
}

enum PartitionKeySuffix {
  FRIEND = 'friend',
  MESSAGES = 'messages'
}

enum SortKeyPrefix {
  CONVERSATION_MEMBER = 'cm',
  MESSAGE = 'm'
}

const toUser = (item: Record<string, AttributeValue>): Pick<User, "id" | "name" | "avatarUrl"> => {
  const res = unmarshall(item)

  if (!res.pk)
    throw Error("Record doesn't have partition key")

  if (res.sk !== 'profile')
    throw Error("Invalid user profile record")

  const [prefix, id] = (res.pk as string).split("#")

  if (!prefix || prefix !== PartitionKeyPrefix.USER)
    throw Error(`Invalid user record key: ${res.pk}`)

  return {
    id,
    name: res.name,
    avatarUrl: res.avatarUrl
  }
}

const toFriend = (item: Record<string, AttributeValue>): Friend => {
  const res = unmarshall(item)

  if (!res.pk)
    throw Error("Record doesn't have partition key")

  const [prefix, userId, suffix] = res.pk.split('#')

  const isInvalidPrefix = !prefix || prefix !== PartitionKeyPrefix.USER
  const isInvalidSuffix = !suffix || suffix !== PartitionKeySuffix.FRIEND

  if (isInvalidPrefix || isInvalidSuffix || !userId)
    throw Error(`Invalid friend record ${res.pk}`)

  return {
    id: res.sk,
    // userId,
    sentBy: res.sentBy,
    status: res.status
  }
}

const toConversation = (item: Record<string, AttributeValue>): Conversation => {
  const res = unmarshall(item)

  if (!res.pk)
    throw Error("Record doesn't have partition key")

  const [prefix, conversationId] = res.pk.split('#')

  const isInvalidPrefix = !prefix || prefix !== PartitionKeyPrefix.CONVERSATION

  if (isInvalidPrefix || !conversationId)
    throw Error(`Invalid friend record ${res.pk}`)

  return {
    id: conversationId
  }
}

const toMessage = (item: Record<string, AttributeValue>): Message => {
  const res = unmarshall(item)

  if (!res.pk)
    throw Error("Record doesn't have partition key")

  const [prefix, conversationId, suffix] = res.pk.split('#')

  const isInvalidPrefix = !prefix || prefix !== PartitionKeyPrefix.CONVERSATION
  const isInvalidSuffix = !suffix || suffix !== PartitionKeySuffix.MESSAGES

  if (isInvalidPrefix || isInvalidSuffix)
    throw Error(`Invalid message record pk ${res.pk}`)

  if (!res.sk)
    throw Error("Record doesn't have sort key")

  const [messagePrefix, messageId] = res.sk.split('#')

  const isInvalidMessagePrefix = !messagePrefix || messagePrefix !== SortKeyPrefix.MESSAGE
  if (isInvalidMessagePrefix)
    throw Error(`Invalid message record sk ${res.sk}`)

  return {
    id: messageId,
    conversationId,
    content: res.content,
    contentType: res.contentType,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
    sentBy: res.sentBy,
    replyTo: res.replyTo
  }
}


const toUpdateExpression = (args: { [key: string]: any }) => {
  let ExpressionAttributeNames: { [k: string]: string } = {}
  let ExpressionAttributeValues: { [k: string]: AttributeValue } = {}
  let UpdateExpression = 'SET '

  for (const [key, value] of Object.entries(args)) {
    ExpressionAttributeNames[`#${key}`] = key
    ExpressionAttributeValues[`:${key}`] = marshall(value)
    UpdateExpression += `#${key} = :${key}`
  }

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression
  }
}

const keyToCursor = (item?: Record<string, AttributeValue>): string | undefined => {
  return item?.LastEvaluatedKey ? Buffer.from(JSON.stringify(item.LastEvaluatedKey)).toString('base64') : undefined
}

const cursorToKey = (cursor?: string): Record<string, AttributeValue> | undefined => {
  return cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString('ascii')) : undefined
}


export {
  toUser,
  toFriend,
  toConversation,
  toMessage,
  toUpdateExpression,
  keyToCursor,
  cursorToKey,
}
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import Model from './types'
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { Friend } from '../controllers/types'

export const DYNAMODB_READ_LIMIT = 200
enum PartitionKeyPrefix {
  USER = 'u',
  CONVERSATION = 'c'
}

enum PartitionKeySuffix {
  FRIEND = 'friend'
}

const toUser = (item: Record<string, AttributeValue>): Pick<Model.User, "id" | "name" | "avatarUrl"> => {
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

export {
  toUser,
  toFriend,
  toUpdateExpression
}
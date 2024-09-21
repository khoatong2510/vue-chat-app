import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { ID, User } from "./types"

import { AppSyncIdentityCognito } from 'aws-lambda'

const USER_TABLE_NAME = "UserTable" as const

const listUsers = (dynamodb: DocumentClient, userContext: AppSyncIdentityCognito) => async (): Promise<User[]> => {
  const res = await dynamodb.query({
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: "id != :id",
    ExpressionAttributeValues: {
      ':id': userContext.sub
    },
    ScanIndexForward: true
  }).promise()

  return res.Items as User[]
}

const getUser = (dynamodb: DocumentClient, userContext: AppSyncIdentityCognito) => async (id: string): Promise<User> => {
  const res = await dynamodb.get({
    TableName: USER_TABLE_NAME,
    Key: { id },
  }).promise()

  if (!res.Item)
    throw Error("User Not Found")

  return res.Item as User
}

const suggestFriend = (dynamodb: DocumentClient, userContext: AppSyncIdentityCognito) => async (): Promise<ID[]> => {
  const res = await dynamodb.get({
    TableName: USER_TABLE_NAME,
    Key: { id: userContext.sub }
  }).promise()

  if (!res.Item)
    throw Error(`User profile not found ${userContext.sub}`)

  const user = res.Item as User

  const friendIds = (user.friends || []).map(f => f.id)

  const idsExpr = friendIds.map((id, index) => `id${index}`).join(',')

  const idsAttrValues = friendIds.reduce((a, c, i) => {
    const key = `id${i}`
    a[key] = c
    return a
  }, {} as { [key: string]: string })

  const friendRes = await dynamodb.query({
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: "#id != :id",
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':id': userContext.sub,
      ...idsAttrValues
    },
    FilterExpression: `NOT #id IN (${idsExpr})`,
    Limit: 10
  }).promise()

  return (friendRes.Items as User[])?.map(user => user.id)
}

export default {
  listUsers,
  getUser,
  suggestFriend,
}
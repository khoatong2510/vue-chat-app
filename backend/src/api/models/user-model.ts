

import { DbContext } from "../lambda/types"
import { Friend, FriendStatus, ID, User } from "../controllers/types"
import { ScanCommand, GetItemCommand, QueryCommand, AttributeValue, Select, PutItemCommand, QueryCommandInput, GetItemCommandInput, ScanCommandInput, UpdateItemCommand, ReturnValue, UpdateItemCommandInput, PutItemCommandInput, DeleteItemCommandInput, DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Model from './types'
import { DYNAMODB_READ_LIMIT, toFriend, toUpdateExpression, toUser } from "./utils"

const listUsers = ({ dynamodb, chatTableName }: DbContext) => async (cursor?: string): Promise<Model.CursorPaged<Pick<User, "id" | "name" | "avatarUrl">>> => {
  let lastKey, json
  if (cursor) {
    lastKey = Buffer.from(cursor, 'base64').toString('ascii')
    json = JSON.parse(lastKey)
  }

  const input: QueryCommandInput = {
    TableName: chatTableName,
    IndexName: 'reverse-index',
    KeyConditionExpression: 'sk = :skval',
    ExpressionAttributeValues: marshall({
      ':skval': "profile"
    }),
    Limit: DYNAMODB_READ_LIMIT,
    ExclusiveStartKey: cursor ? json : undefined,
  }

  const command = new QueryCommand(input)
  const res = await dynamodb.send(command)

  return {
    items: res.Items ? res.Items.map(toUser) : [],
    cursor: res.LastEvaluatedKey ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64') : undefined
  }
}

const getUser = ({ dynamodb, chatTableName }: DbContext) => async (id: ID): Promise<Pick<Model.User, "id" | "name" | "avatarUrl"> | undefined> => {
  const input: GetItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({ pk: `u#${id}`, sk: 'profile' })
  }
  const command = new GetItemCommand(input)
  const res = await dynamodb.send(command)

  const user = res.Item ? toUser(res.Item) : undefined
  return user
}

const listFriendsByUserId = ({ dynamodb, chatTableName }: DbContext) => async (id: ID): Promise<Friend[]> => {
  const input: QueryCommandInput = {
    TableName: chatTableName,
    KeyConditionExpression: `pk = :partitionKeyVal`,
    ExpressionAttributeValues: marshall({
      ":partitionKeyVal": `u#${id}#friend`
    })
  }

  const command = new QueryCommand(input)
  const res = await dynamodb.send(command)

  return (res.Items || []).map(toFriend)
}

const createUser = ({ dynamodb, chatTableName }: DbContext) => async (user: User, utcNow: Date): Promise<void> => {
  const input: PutItemCommandInput = {
    TableName: chatTableName,
    Item: marshall({
      pk: `u#${user.id}`,
      sk: "profile",
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: utcNow.getTime()
    })
  }

  const command = new PutItemCommand(input)

  await dynamodb.send(command)
}

const createFriend = ({ dynamodb, chatTableName }: DbContext) => async (userId: ID, friendId: ID, status: FriendStatus, sentBy: ID): Promise<void> => {
  const input: PutItemCommandInput = {
    TableName: chatTableName,
    Item: marshall({
      pk: `u#${userId}#friend`,
      sk: friendId,
      status,
      sentBy
    })
  }

  const command = new PutItemCommand(input)
  await dynamodb.send(command)
}

const updateFriend = ({ dynamodb, chatTableName }: DbContext) => async (userId: ID, friendId: ID, args: Model.FriendUpdateArgs): Promise<void> => {
  const updateExpression = toUpdateExpression(args)

  const input: UpdateItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `u#${userId}#friend`,
      sk: friendId,
    }),
    ...updateExpression
  }

  const command = new UpdateItemCommand(input)
  await dynamodb.send(command)
}

const deleteFriend = ({ dynamodb, chatTableName }: DbContext) => async (userId: ID, friendId: ID): Promise<void> => {
  const input: DeleteItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `u#${userId}#friend`,
      sk: friendId
    })
  }

  const command = new DeleteItemCommand(input)
  await dynamodb.send(command)
}

const updateUser = ({ dynamodb, chatTableName }: DbContext) => async (id: ID, args: Model.UserUpdateArgs): Promise<void> => {
  // construct attributes names
  const updateExpression = toUpdateExpression(args)

  const input = {
    TableName: chatTableName,
    Key: marshall({
      pk: `u#${id}`,
      sk: 'profile'
    }),
    ...updateExpression
  }

  const command = new UpdateItemCommand(input)
  await dynamodb.send(command)
}

const deleteUser = ({ dynamodb, chatTableName }: DbContext) => async (id: ID): Promise<void> => {
  const input: DeleteItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `u#${id}`,
      sk: 'profile'
    })
  }

  const command = new DeleteItemCommand(input)
  await dynamodb.send(command)
}

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  updateFriend,
  deleteFriend,
  listFriendsByUserId
}



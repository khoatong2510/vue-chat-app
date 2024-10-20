

import { DbContext } from "../lambda/types"
import { Friend, FriendStatus, ID, User } from "../controllers/types"
import { ScanCommand, GetItemCommand, QueryCommand, AttributeValue, Select, PutItemCommand, QueryCommandInput, GetItemCommandInput, ScanCommandInput, UpdateItemCommand, ReturnValue, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Model from './types'

const DYNAMODB_READ_LIMIT = 200

const listUsers = ({ dynamodb, userTableName }: DbContext) => async (): Promise<User[]> => {
  // TODO: handling paging
  const input = {
    TableName: userTableName,
    Limit: DYNAMODB_READ_LIMIT
  }

  const command = new ScanCommand(input)

  const res = await dynamodb.send(command)

  return res.Items?.map(item => unmarshall(item)) as User[]
}

const getUser = ({ dynamodb, userTableName }: DbContext) => async (id: ID): Promise<Model.User | undefined> => {
  const input: GetItemCommandInput = {
    TableName: userTableName,
    Key: marshall({ id })
  }
  const command = new GetItemCommand(input)
  const res = await dynamodb.send(command)

  const user = res.Item ? unmarshall(res.Item) as Model.User : undefined
  return user
}

const getFriendSuggestion = ({ dynamodb, userTableName }: DbContext) => async (id: ID, friendIds: ID[]): Promise<User[]> => {
  try {
    const ids = [id, ...friendIds]
    const idsExpr = ids.map((_, index) => `:id${index}`).join(',')

    const idsAttrValues = ids.reduce((a, c, i) => {
      const key = `:id${i}`
      a[key] = marshall(c)
      return a
    }, {} as { [key: string]: AttributeValue })

    const input: ScanCommandInput = {
      TableName: userTableName,
      ExpressionAttributeNames: {
        '#id': 'id',
        '#name': 'name',
        '#avatarUrl': 'avatarUrl'
      },
      ExpressionAttributeValues: {
        ...idsAttrValues
      },
      FilterExpression: `NOT #id IN (${idsExpr})`,
      ProjectionExpression: "#id, #name, #avatarUrl",
      Limit: 10,
    }

    const command = new ScanCommand(input)
    const friendRes = await dynamodb.send(command)

    return friendRes.Items?.map(item => unmarshall(item)) as User[]
  } catch (error) {
    console.log("getFriendSuggestion", error)
    throw error
  }
}

const createUser = ({ dynamodb, userTableName }: DbContext) => async (user: User): Promise<void> => {
  const input = {
    TableName: userTableName,
    Item: marshall(user)
  }
  const command = new PutItemCommand(input)

  await dynamodb.send(command)
}

const initUserFriend = ({ dynamodb, userTableName }: DbContext) => async (userId: ID): Promise<void> => {
  try {
    const input: UpdateItemCommandInput = {
      TableName: userTableName,
      Key: marshall({ id: userId }),
      UpdateExpression: "SET friends = :defaultValue",
      ExpressionAttributeValues: marshall({
        ':defaultValue': {}
      })
    }

    const command = new UpdateItemCommand(input)
    await dynamodb.send(command)
  } catch (error) {
    throw error
  }
}

const updateUserFriend = ({ dynamodb, userTableName }: DbContext) => async (userId: ID, friendId: ID, args: Omit<Friend, 'id'>): Promise<ID> => {
  try {
    const input: UpdateItemCommandInput = {
      TableName: userTableName,
      Key: marshall({ id: userId }),
      ExpressionAttributeNames: {
        "#id": friendId
      },
      ExpressionAttributeValues: marshall({
        ":value": {
          ...args
        }
      }),
      UpdateExpression: "SET friends.#id = :value",
      ReturnValues: ReturnValue.UPDATED_NEW,
    }

    const command = new UpdateItemCommand(input)
    const res = await dynamodb.send(command)

    if (!res.Attributes)
      throw Error("Something wrong when updating user data")

    const updatedFriends = (unmarshall(res.Attributes) as User).friends || {}
    const updatedFriendId = Object.keys(updatedFriends).find(key => key === friendId)

    if (!updatedFriendId)
      throw Error("Something wrong when updating user data")

    return updatedFriendId
  } catch (error) {
    console.log("updateUserFriend", error)
    throw error
  }
}

const deleteUserFriend = ({ dynamodb, userTableName }: DbContext) => async (userId: ID, friendId: ID): Promise<void> => {
  try {
    const input: UpdateItemCommandInput = {
      TableName: userTableName,
      Key: marshall({ id: userId }),
      ExpressionAttributeNames: {
        "#id": friendId
      },
      UpdateExpression: "REMOVE friends.#id"
    }

    const command = new UpdateItemCommand(input)
    await dynamodb.send(command)

  } catch (error) {
    throw error
  }
}

const updateUser = ({ dynamodb, userTableName }: DbContext) => async (id: ID, args: Model.UserUpdateArgs): Promise<void> => {
  try {
    // construct attributes names
    let ExpressionAttributeNames: { [k: string]: string } = {}
    let ExpressionAttributeValues: { [k: string]: AttributeValue } = {}
    let UpdateExpression = 'SET '

    for (const [key, value] of Object.entries(args)) {
      ExpressionAttributeNames[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = marshall(value)
      UpdateExpression += `#${key} = :${key}`
    }

    const input = {
      TableName: userTableName,
      Key: marshall({ id }),
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression,
      ReturnValues: ReturnValue.NONE
    }

    const command = new UpdateItemCommand(input)
    await dynamodb.send(command)
  } catch (error) {
    console.log("updateUser error", error)
    throw error
  }
}

const deleteUser = () => {

}

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getFriendSuggestion,
  initUserFriend,
  updateUserFriend,
  deleteUserFriend
}



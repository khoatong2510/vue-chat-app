

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

const getUser = ({ dynamodb, userTableName }: DbContext) => async (id: ID): Promise<User | undefined> => {
  const input: GetItemCommandInput = {
    TableName: userTableName,
    Key: marshall({ id })
  }
  const command = new GetItemCommand(input)
  const res = await dynamodb.send(command)

  const user = res.Item ? unmarshall(res.Item) as User : undefined
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

const addToFriendList = ({ dynamodb, userTableName }: DbContext) => async (userId: ID, args: Friend): Promise<ID> => {
  try {
    const input: UpdateItemCommandInput = {
      TableName: userTableName,
      Key: marshall({ id: userId }),
      ExpressionAttributeNames: {
        "#friends": "friends"
      },
      ExpressionAttributeValues: marshall({
        ":friend": [args],
        ":empty": []
      }),
      UpdateExpression: "SET #friends = list_append(if_not_exists(#friends, :empty), :friend)",
      ReturnValues: ReturnValue.UPDATED_NEW
    }

    const command = new UpdateItemCommand(input)
    const res = await dynamodb.send(command)

    if (!res.Attributes)
      throw Error("Something wrong when updating user data")

    const updatedFriends = (unmarshall(res.Attributes) as User).friends || []

    const friend = updatedFriends.find(friend => friend.id === args.id && friend.status === args.status)

    if (!friend)
      throw Error("Something wrong when updating user data")

    return friend.id
  } catch (error) {
    console.log("addToFriendList", error)
    throw error
  }
}

const updateUser = ({ dynamodb, userTableName }: DbContext) => async (id: ID, args: Model.UserUpdateArgs): Promise<void> => {
  try {
    // construct attributes names
    let ExpressionAttributeNames: { [k: string]: string } = {}
    let ExpressionAttributeValues: { [k: string]: AttributeValue } = {}
    let UpdateExpression = 'SET '

    // console.log('args', args, Object.entries(args))

    for (const [key, value] of Object.entries(args)) {
      // console.log("key", key)
      // console.log("value", value, JSON.stringify(marshall(value), null, 2))

      ExpressionAttributeNames[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = marshall(value)
      UpdateExpression += `#${key} = :${key}`
    }

    // console.log('ExpressionAttributeNames', ExpressionAttributeNames)
    // console.log('ExpressionAttributeValues', ExpressionAttributeValues)
    // console.log('UpdateExpression', UpdateExpression)

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
  addToFriendList
}



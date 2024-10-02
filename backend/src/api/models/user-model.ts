

import { DbContext } from "../lambda/types"
import { ID, User } from "../controllers/types"
import { ScanCommand, GetItemCommand, QueryCommand, AttributeValue, Select, PutItemCommand, QueryCommandInput, GetItemCommandInput, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

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

const getFriendSuggestion = ({ dynamodb, userTableName }: DbContext) => async (id: ID, friendIds: ID[]): Promise<ID[]> => {
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
      },
      ExpressionAttributeValues: {
        ...idsAttrValues
      },
      FilterExpression: `NOT #id IN (${idsExpr})`,
      ProjectionExpression: "id",
      Limit: 10,
    }

    const command = new ScanCommand(input)
    const friendRes = await dynamodb.send(command)

    console.log("friendRes", friendRes)

    return friendRes.Items?.map(item => unmarshall(item).id) as string[]
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

const updateUser = () => {

}

const deleteUser = () => {

}

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getFriendSuggestion
}



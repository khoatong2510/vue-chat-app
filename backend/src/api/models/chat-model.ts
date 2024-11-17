import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { DbContext } from "../lambda/types"
import { DYNAMODB_READ_LIMIT } from "./utils"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { ID } from "../controllers/types"

const listConversationsByUserId = ({ dynamodb, chatTableName }: DbContext) => {
  // const input: QueryCommandInput = {
  //   TableName: chatTableName,
  //   Limit: DYNAMODB_READ_LIMIT,
  //   KeyConditionExpression: 
  // }
}

const listMessagesByConversationId = ({ dynamodb, chatTableName }: DbContext) => async (id: ID) => {
  // const input: QueryCommandInput = {
  //   TableName: chatTableName,
  //   Limit: DYNAMODB_READ_LIMIT,
  // }

  // const command = new QueryCommand(input)

  // const res = await dynamodb.send(command)

  // return res.Items?.map(item => unmarshall(item) as Model.Message[])
}

const createConversation = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, userIds: ID[], timestamp: Date) => {
  const putRequests = userIds.map(id => ({
    PutRequest: {
      Item: marshall({
        pk: conversationId,
        sk: id,
        createdAt: timestamp.toISOString()
      })
    }
  }))

  const input: BatchWriteItemCommandInput = {
    RequestItems: {
      [chatTableName]: putRequests
    }
  }

  const command = new BatchWriteItemCommand(input)
  await dynamodb.send(command)
}

const createMessage = ({ dynamodb, chatTableName }: DbContext) => async (id: ID, content: string, sentBy: ID) => {

}

const updateMessage = ({ dynamodb, chatTableName }: DbContext) => async (id: ID, createdAt: Date, value: string) => {

}

const deleteMessage = ({ dynamodb, chatTableName }: DbContext) => async (id: ID, createdAt: Date) => {

}

export default {
  listConversationsByUserId,
  listMessagesByConversationId,
  createConversation,
  createMessage,
  updateMessage,
  deleteMessage
}
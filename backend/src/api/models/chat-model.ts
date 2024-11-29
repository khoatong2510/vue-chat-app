import { BatchWriteItemCommand, BatchWriteItemCommandInput, DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb"
import { DbContext } from "../lambda/types"
import { cursorToKey, DYNAMODB_READ_LIMIT, keyToCursor, toConversation, toMessage } from "./utils"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { CursorPaged, DynamoDbGSI, DynamoDbLSI } from "./types"
import { Conversation, ID, Message } from "../types"

const listConversationsByUserId = ({ dynamodb, chatTableName }: DbContext) => async (id: ID, cursor?: string): Promise<CursorPaged<Conversation>> => {
  const input: QueryCommandInput = {
    TableName: chatTableName,
    IndexName: DynamoDbGSI.RERVERSE_INDEX,
    KeyConditionExpression: "sk = :skVal",
    ExpressionAttributeValues: marshall({
      ":skVal": `cm#${id}`
    }),
    Limit: DYNAMODB_READ_LIMIT,
    ExclusiveStartKey: cursorToKey(cursor)
  }

  const command = new QueryCommand(input)
  const res = await dynamodb.send(command)

  const items = (res.Items || []).map(item => toConversation(item))

  return {
    items,
    cursor: keyToCursor(res.LastEvaluatedKey)
  }
}

const listMembersByConversationId = ({ dynamodb, chatTableName }: DbContext) => async (id: ID): Promise<ID[]> => {
  const input: QueryCommandInput = {
    TableName: chatTableName,
    KeyConditionExpression: "pk = :pkVal",
    ExpressionAttributeValues: marshall({
      ":pkVal": `c#${id}`
    })
  }

  const command = new QueryCommand(input)
  const res = await dynamodb.send(command)

  return (res.Items || []).map(item => unmarshall(item).sk.split('#')[1])
}

const listMessagesByConversationId = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, cursor?: string, limit: number = DYNAMODB_READ_LIMIT): Promise<CursorPaged<Message>> => {
  const input: QueryCommandInput = {
    TableName: chatTableName,
    IndexName: DynamoDbLSI.MESSAGE_BY_CREATEDAT,
    KeyConditionExpression: `pk = :pkVal`,
    ExpressionAttributeValues: marshall({
      ":pkVal": `c#${conversationId}#messages`
    }),
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: cursorToKey(cursor)
  }

  const command = new QueryCommand(input)
  const res = await dynamodb.send(command)
  const items = (res.Items || []).map(toMessage)

  return {
    items,
    cursor: keyToCursor(res.LastEvaluatedKey)
  }
}

const getConversationMember = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, userId: ID) => {
  const input: GetItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `c#${conversationId}`,
      sk: `cm#${userId}`
    })
  }

  const command = new GetItemCommand(input)
  const res = await dynamodb.send(command)

  return res.Item ? unmarshall(res.Item) : undefined
}

const getConversationLastMessage = (dbContext: DbContext) => async (conversationId: ID): Promise<Message> => {
  const res = await listMessagesByConversationId(dbContext)(conversationId, undefined, 1)
  return res.items[0]
}

const createConversation = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, userIds: ID[], createdAt: Date) => {
  const putRequests = userIds.map(id => ({
    PutRequest: {
      Item: marshall({
        pk: `c#${conversationId}`,
        sk: `cm#${id}`,
        createdAt: createdAt.toISOString()
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

const deleteConversation = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, userId: ID) => {
  const input: DeleteItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `c#${conversationId}`,
      sk: `cm#${userId}`
    })
  }

  const command = new DeleteItemCommand(input)

  await dynamodb.send(command)
}

const createMessage = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, args: Omit<Message, "conversationId">) => {
  const input: PutItemCommandInput = {
    TableName: chatTableName,
    Item: marshall({
      pk: `c#${conversationId}#messages`,
      sk: `m#${args.id}`,
      content: args.content,
      contentType: args.contentType,
      createdAt: args.createdAt.toISOString(),
      updatedAt: args.updatedAt,
      sentBy: args.sentBy,
      replyTo: args.replyTo
    }, { removeUndefinedValues: true })
  }

  const command = new PutItemCommand(input)
  await dynamodb.send(command)
}

const updateMessage = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, messageId: ID, args: Pick<Message, "content" | "contentType" | "updatedAt">) => {
  const input: UpdateItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `c#${conversationId}#messages`,
      sk: `m#${messageId}`,
      content: args.content,
      contentType: args.contentType,
      updatedAt: args.updatedAt?.toISOString()
    })
  }

  const command = new UpdateItemCommand(input)
  await dynamodb.send(command)
}

const deleteMessage = ({ dynamodb, chatTableName }: DbContext) => async (conversationId: ID, messageId: ID) => {
  const input: DeleteItemCommandInput = {
    TableName: chatTableName,
    Key: marshall({
      pk: `c#${conversationId}#messages`,
      sk: `m#${messageId}`
    })
  }

  const command = new DeleteItemCommand(input)
  dynamodb.send(command)
}

export default {
  listConversationsByUserId,
  listMembersByConversationId,
  listMessagesByConversationId,
  getConversationLastMessage,
  getConversationMember,
  createConversation,
  deleteConversation,
  createMessage,
  updateMessage,
  deleteMessage
}
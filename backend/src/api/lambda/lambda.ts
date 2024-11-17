import { Context } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import UserController from '../controllers/user-controller'
import ChatController from '../controllers/chat-controller'
import { AppsyncResolverEvent, DbContext, HandlerReturnType, Controller } from './types'

if (!process.env.CHAT_TABLE)
  throw Error("CHAT_TABLE value is not set")

const dbContext: DbContext = {
  dynamodb: new DynamoDBClient(),
  chatTableName: process.env.CHAT_TABLE
}

export const handler = async (event: AppsyncResolverEvent, context: Context): Promise<HandlerReturnType> => {
  if (!event.identity) {
    console.warn("no identity")
  }

  const field: string = event.field
  const args = event.argurments

  const controllers: Controller = {
    ...UserController,
    ...ChatController
  }

  if (!field)
    throw Error(`Invalid field ${field}`)

  if (!Object.keys(controllers).includes(field))
    throw Error(`No operator to handle ${field} resolver`)

  try {
    const asyncFunc = controllers[field](dbContext, { id: event.identity.sub })
    const res = await asyncFunc(args)

    return res
  } catch (err) {
    const res = {
      message: (err as Error).message,
      name: (err as Error).name
    }

    return {
      error: res
    }
  }
}

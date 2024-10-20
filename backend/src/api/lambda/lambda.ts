import { Context } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import UserController from '../controllers/user-controller'
import { AppsyncResolverEvent, DbContext, HandlerReturnType, Controller } from './types'

if (!process.env.USER_TABLE)
  throw Error("USER_TABLE value is not set")

const dbContext: DbContext = {
  dynamodb: new DynamoDBClient(),
  userTableName: process.env.USER_TABLE
}

export const handler = async (event: AppsyncResolverEvent, context: Context): Promise<HandlerReturnType> => {
  if (!event.identity) {
    console.warn("no identity")
  }

  const field: string = event.field
  const args = event.argurments

  const controllers: Controller = {
    ...UserController
  }

  console.log("field", event.field)
  console.log("args", event.argurments)

  if (!field)
    throw Error(`Invalid field ${field}`)

  if (!Object.keys(UserController).includes(field))
    throw Error(`No operator to handle ${field} resolver`)

  try {
    const asyncFunc = controllers[field](dbContext, { id: event.identity.sub })
    const res = await asyncFunc(args)

    return res
  } catch (error) {
    return {
      error: error as any
    }
  }
}

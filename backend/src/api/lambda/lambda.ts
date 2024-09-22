import { Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import UserOperations from '../operations/user'
import { AppSyncIdentityCognito } from '@aws-appsync/utils'

const dynamodb = new DynamoDB.DocumentClient()

type AppsyncResolverEvent = {
  field: string,
  argurments: object,
  identity: AppSyncIdentityCognito
}

type HandlerReturnType = {
  result?: object,
  error?: {
    message: string,
    type?: string
  }
}

type Operations = {
  [key: string]: Function
}


export const handler = async (event: AppsyncResolverEvent, context: Context): Promise<HandlerReturnType> => {
  console.log("event", event)
  console.log("context", context)

  if (!event.identity) {
    console.warn("no identity")
  }

  const field: string = event.field
  const args = event.argurments

  const operations: Operations = {
    ...UserOperations
  }

  console.log("field", field)
  console.log("args", args)

  if (!field)
    throw Error(`Invalid field ${field}`)

  if (!Object.keys(operations).includes(field))
    throw Error(`No operator to handle ${field} resolver`)

  try {
    const asyncFunc = operations[field](dynamodb, { id: event.identity.sub })
    const res = await asyncFunc(args)

    return {
      result: res
    }
  } catch (error) {
    return {
      error: {
        message: (error as Error).message
      }
    }
  }
}

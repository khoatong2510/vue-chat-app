import { Context, Handler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import UserOperations from '../operations/user'

const dynamodb = new DynamoDB.DocumentClient()

type AppsyncResolverEvent = {
  field: string,
  argurments: object
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
  if (!context.identity) {
    console.warn("no identity")
  }

  const field: string = event.field
  const args = event.argurments

  const operations: Operations = {
    ...UserOperations
  }

  if (!Object.keys(operations).includes(field))
    throw Error(`No operator to handle ${field} resolver`)

  try {
    const res = await operations[field](dynamodb, { ...context.identity })(args)

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

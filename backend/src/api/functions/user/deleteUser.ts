import { Context } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'

type DeleteUserInput = {
  id: string
}

type DeleteUserResult = {
  id: string
}

const request = (ctx: Context<DeleteUserInput>) => {
  const key = { id: ctx.args.id }
  return dynamodb.remove({ key })
}

const response = (ctx: Context<any, any, any, any, DeleteUserResult>) => {
  const { error, result } = ctx
  
  if (error) {
    return util.appendError(error.message, error.type, result)
  }

  return ctx.result.id
}

export {
  request,
  response
}
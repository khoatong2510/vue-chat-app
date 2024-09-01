import { Context } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'
import { CreateUserArgs } from './types'

const request = (ctx: Context<CreateUserArgs>) => {
  return dynamodb.put({ key: { id: ctx.args.input.id }, item: ctx.args.input })
}

const response = (ctx: Context) => {
  return ctx.result
}

export {
  request,
  response
}
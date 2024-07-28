import { Context, util } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'
import { CreateUserArgs } from './types'


const request = (ctx: Context<CreateUserArgs>) => {
  const id = util.autoId()
  const key = { id }
  const item = { id, ...ctx.args.input }
  
  return dynamodb.put({ key, item })
}

const response = (ctx: Context) => {
  return ctx.result
}

export {
  request,
  response
}
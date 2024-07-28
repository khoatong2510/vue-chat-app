import { Context } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'

const request = (ctx: Context) => {
  return dynamodb.scan({})
}

const response = (ctx: Context) => {
  return ctx.result.items
}

export {
  request,
  response
}
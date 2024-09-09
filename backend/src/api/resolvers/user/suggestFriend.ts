import { Context } from "@aws-appsync/utils"
import * as dynamodb from '@aws-appsync/utils/dynamodb'

const request = (ctx: Context) => {
  return dynamodb.query({
    query: {
      id: { ne: ctx.args.id }
    },
    limit: 5
  })
}

const response = (ctx: Context) => {
  return ctx.result.items
}

export {
  request,
  response
}
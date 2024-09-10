import { Context } from "@aws-appsync/utils"
import * as dynamodb from '@aws-appsync/utils/dynamodb'

const request = (ctx: Context) => {
  console.log("ctx request", ctx.args)
  return dynamodb.scan({
    limit: 5,
    filter: {
      id: { ne: ctx.args.id }
    }
  })
}

const response = (ctx: Context) => {
  console.log("ctx result", ctx)
  return ctx.result.items
}

export {
  request,
  response
}
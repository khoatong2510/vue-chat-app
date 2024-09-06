import { Context } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'

const request = (ctx: Context) => {
  return dynamodb.query({
    query: {
      id: { eq: ctx.args.id }
    }
  })
}

const response = (ctx: Context) => {
  // console.log("getUser resolver response context", ctx)
  return ctx.result.items[0]
}

export {
  request,
  response
}
import { Context, Request, util } from '@aws-appsync/utils'
import * as dynamodb from '@aws-appsync/utils/dynamodb'

type UpdateUserArgs = {
  id: string,
  values: {
    name: string,
    avatarUrl: string
  }
}

const request = (ctx: Context<UpdateUserArgs>) => {

  return dynamodb.update({
    key: ctx.args.id,
    update: {
      ...ctx.args.values
    }
  })
}

const response = (ctx: Context) => {
  return ctx.result;
}

export {
  request,
  response
}
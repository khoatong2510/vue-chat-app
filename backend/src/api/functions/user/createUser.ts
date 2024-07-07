import { Context, Request, util } from '@aws-appsync/utils'

type CreateUserArgs = {
  input: {
    name: string,
    avatarUrl: string
  }
}

const request = (ctx: Context<CreateUserArgs>) => {
  return { 
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      id: util.autoId()
    }),
    attributeValues: util.dynamodb.toMapValues(ctx.args.input)
  }
}

const response = (ctx: Context) => {
  return ctx.result;
}

export {
  request,
  response
}
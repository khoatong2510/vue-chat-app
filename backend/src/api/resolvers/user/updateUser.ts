import { Context } from '@aws-appsync/utils'

const request = (ctx: Context) => {
  // validation here
  return ctx
}

const response = (ctx: Context) => {
  return ctx.result
}

export {
  request,
  response
}
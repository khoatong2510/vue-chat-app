import { Context, util } from "@aws-appsync/utils"

const request = (ctx: Context) => {
  const { source, args, identity } = ctx
  console.log('request ctx', ctx)
  return {
    operation: 'Invoke',
    payload: {
      field: ctx.info.fieldName,
      argurments: args,
      source,
      identity
    }
  }
}

const response = (ctx: Context) => {
  // handling error here
  console.log("resolver ctx", ctx)
  if (ctx.result?.error?.message)
    util.error(ctx.result.error.message, "Runtime Error")
  else
    return ctx.result
}

export {
  request,
  response
}
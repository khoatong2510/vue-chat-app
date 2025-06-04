import { Context, util } from "@aws-appsync/utils"

const request = (ctx: Context) => {
  const { source, args, identity } = ctx
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
  if (ctx.result?.error) {
    const { message, name } = ctx.result.error
    if (message && name)
      util.error(message, name)
    else
      util.error("Unknown Error", "Runtime Error")
  }
  else
    return ctx.result
}

export {
  request,
  response
}
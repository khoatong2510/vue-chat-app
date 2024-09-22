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
  if (ctx.result.error)
    util.error(ctx.result.error.message, "Runtime Error")
  else if (Object.keys(ctx.result).length === 0) // empty object
    return null
  else
    return ctx.result
}

export {
  request,
  response
}
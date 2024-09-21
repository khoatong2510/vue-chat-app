import { Context } from "@aws-appsync/utils"

const request = (ctx: Context) => {
  const { source, args } = ctx
  return {
    operation: 'Invoke',
    payload: { field: ctx.info.fieldName, argurments: args, source }
  }
}

const response = (ctx: Context) => {
  return ctx.result
}

export {
  request,
  response
}
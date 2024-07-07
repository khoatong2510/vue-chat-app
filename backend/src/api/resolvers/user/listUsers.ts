function request(ctx: any) {
  return { operation: 'Scan' }
}

function response(ctx: any) {
  return ctx.result.items
}

export {
  request,
  response
}
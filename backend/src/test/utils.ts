import userController from "../api/controllers/user-controller"
import { DbContext } from "../api/lambda/types"

import { v4 as uuid } from 'uuid'

export const createUser = async (dbContext: DbContext) => {
  const id = uuid()
  const context = { id }

  await userController.createUser(dbContext, context)({
    input: {
      name: `t-${id.split('-')[0]}`,
      avatarUrl: `at-${id.split('-')[0]}`
    }
  })

  return id
}
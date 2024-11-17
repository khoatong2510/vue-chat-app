import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fromSSO } from "@aws-sdk/credential-providers"
import userController from '../api/controllers/user-controller'

const dynamodb = new DynamoDBClient({
  region: 'ap-southeast-2',
  credentials: fromSSO({
    profile: "admin",
  })
})

const CHAT_TABLE = "ChatTable"

const dbContext = {
  dynamodb,
  chatTableName: CHAT_TABLE
}

const userContext = {
  id: '0f3c264a-af8c-4d58-b8db-6e09ff3f6146'
}

describe("user controller", () => {
  it("getUser", async () => {
    const res = await userController.getUser(dbContext, userContext)({ id: '0f3c264a-af8c-4d58-b8db-6e09ff3f6146' })
    console.log("getUser res", res)
  })
})
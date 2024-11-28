import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { fromSSO } from '@aws-sdk/credential-providers'
import { v4 as uuid } from 'uuid'
import userModel from '../api/models/user-model'
import chatModel from '../api/models/chat-model'
import userController from '../api/controllers/user-controller'

const dynamodb = new DynamoDBClient({
  region: 'ap-southeast-2',
  credentials: fromSSO({
    profile: "admin",
  })
})
const CHAT_TABLE = "ChatTable2"

const dbContext = {
  dynamodb,
  chatTableName: CHAT_TABLE
}
const main = async () => {
  const messages = await userController.suggestFriend(dbContext, { id: "f91e7438-c061-70f3-687b-364b5b61fbe6" })({ id: "f91e7438-c061-70f3-687b-364b5b61fbe6" })
  console.log(messages)
}

main()
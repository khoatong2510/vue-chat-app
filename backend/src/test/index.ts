import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { fromSSO } from '@aws-sdk/credential-providers'
import { v4 as uuid } from 'uuid'
import userModel from '../api/models/user-model'
import chatModel from '../api/models/chat-model'
import userController from '../api/controllers/user-controller'
import { FriendStatus } from '../api/types'

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
  const idA = "f91e7438-c061-70f3-687b-364b5b61fbe6"
  const idB = "b94ea428-f0f1-70f5-9111-8bb06161f63a"

  await userModel.updateFriend(dbContext)(idA, idB, { status: FriendStatus.REQUESTED })
  await userModel.updateFriend(dbContext)(idB, idA, { status: FriendStatus.REQUESTED })

  const cs = await chatModel.listConversationIdsByUserId(dbContext)(idA)
  if (cs.items.length > 0) {
    const cId = cs.items[0]

    await chatModel.deleteConversation(dbContext)(cId, idA)
    await chatModel.deleteConversation(dbContext)(cId, idB)
  }
}

main()
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { fromSSO } from '@aws-sdk/credential-providers'
import { v4 as uuid } from 'uuid'
import userModel from '../api/models/user-model'
import chatModel from '../api/models/chat-model'
import { FriendStatus } from '../api/controllers/types'

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
const main = async () => {
  const r1 = await userModel.listUsers(dbContext)()

  const u1 = r1.items[0]
  const u2 = r1.items[1]
  // const u3 = r1.items[2]
  // const u4 = r1.items[3]
  // const u5 = r1.items[4]

  // await userModel.createFriend(dbContext)(u1.id, u2.id, FriendStatus.REQUESTED, u1.id)
  // await userModel.createFriend(dbContext)(u1.id, u3.id, FriendStatus.ACCEPTED, u1.id)
  // await userModel.createFriend(dbContext)(u1.id, u4.id, FriendStatus.BLOCKED, u4.id)
  // await userModel.createFriend(dbContext)(u1.id, u5.id, FriendStatus.REQUESTED, u1.id)

  // let lf = await userModel.listFriendsByUserId(dbContext)(u1.id)
  // console.log("BEFORE UPDATE")
  // console.log(lf)

  // await userModel.updateFriend(dbContext)(u1.id, u2.id, { status: FriendStatus.ACCEPTED })

  // lf = await userModel.listFriendsByUserId(dbContext)(u1.id)
  // console.log("AFTER UPDATE")
  // console.log(lf)

  // await userModel.deleteFriend(dbContext)(u1.id, u2.id)

  // lf = await userModel.listFriendsByUserId(dbContext)(u1.id)
  // console.log("AFTER UPDATE")
  // console.log(lf)

  // await userModel.updateUser(dbContext)(u1.id, { name: "u1 updated" })

  // const updatedU1 = await userModel.getUser(dbContext)(u1.id)
  // console.log("AFTER UPDATE", updatedU1)

  const cId = uuid()
  const utcNow = new Date()
  await chatModel.createConversation(dbContext)(cId, [u1.id, u2.id], utcNow)

  const u1conversations = await chatModel.listConversationIdsByUserId(dbContext)(u1.id)
  console.log("u1 conversation", u1conversations)

  const u2conversations = await chatModel.listConversationIdsByUserId(dbContext)(u2.id)
  console.log("u2 conversation", u2conversations)

}

main()
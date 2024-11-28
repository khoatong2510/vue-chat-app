import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fromSSO } from "@aws-sdk/credential-providers"
import userController from '../api/controllers/user-controller'
import { createUser } from "./utils"
import chatController from "../api/controllers/chat-controller"
import { MessageContentType } from "../api/types"

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

describe("chat controller", () => {
  it("create message", async () => {
    const [idA, idB] = await Promise.all([
      createUser(dbContext),
      createUser(dbContext)
    ])

    const ucA = { id: idA }
    const ucB = { id: idB }

    await userController.requestFriend(dbContext, ucA)({ id: idB })
    await userController.acceptFriend(dbContext, ucB)({ id: idA })

    const cA = await chatController.listConversations(dbContext, ucA)(idA)
    const cB = await chatController.listConversations(dbContext, ucB)(idB)

    const cIds = cA.items.filter(c => cB.items.map(cb => cb.id).includes(c.id))
    expect(cIds).toHaveLength(1)

    const cId = cIds[0].id

    console.log("------------- DEBUG -------------")
    console.log("idA", idA)
    console.log("idB", idB)
    console.log("cId", cId)

    // create message
    let message = {
      content: "test message",
      contentType: MessageContentType.TEXT
    }

    await chatController.createMessage(dbContext, ucA)(cId, message)
    const res = await chatController.getConversationMessages(dbContext, ucA)(cId)

    expect(res.items).toHaveLength(1)


  })
})
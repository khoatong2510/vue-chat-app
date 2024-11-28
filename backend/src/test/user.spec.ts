import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fromSSO } from "@aws-sdk/credential-providers"
import userController from '../api/controllers/user-controller'
import userModel from '../api/models/user-model'
import chatModel from '../api/models/chat-model'

import { v4 as uuid } from 'uuid'
import { createUser } from "./utils"

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

describe("user controller", () => {
  it("getUser", async () => {
    const userId = uuid()
    const userContext = {
      id: userId
    }

    const userName = `t-${userId.split('-')[0]}`
    const avatarUrl = `at-${userId.split('-')[0]}`

    await userController.createUser(dbContext, userContext)({
      input: {
        name: userName,
        avatarUrl: avatarUrl
      }
    })

    const res = await userController.getUser(dbContext, userContext)({ id: userId })

    expect(res).toBeDefined()
    expect(res?.id).toBe(userId)
    expect(res?.name).toBe(userName)
    expect(res?.avatarUrl).toBe(avatarUrl)
  })

  it("createUser", async () => {
    const newUserId = uuid()

    const newUserContext = {
      id: newUserId
    }

    const res = await userController.createUser(dbContext, newUserContext)({
      input: {
        name: "int test",
        avatarUrl: "int test avatar url"
      }
    })

    const guRes = await userController.getUser(dbContext, newUserContext)({
      id: newUserId
    })

    expect(guRes).toBeDefined()
    await userModel.deleteUser(dbContext)(newUserId)
  })

  it("suggestFriend", async () => {
    let promises = []

    for (let i = 0; i < 10; i++) {
      promises.push(createUser(dbContext))
    }

    const ids = await Promise.all(promises)

    const userId = ids[0]
    const friendIds = ids.slice(1, 4)

    await userController.requestFriend(dbContext, { id: userId })({ id: friendIds[0] })
    await userController.requestFriend(dbContext, { id: userId })({ id: friendIds[1] })
    await userController.requestFriend(dbContext, { id: userId })({ id: friendIds[2] })

    const SUGGEST_LIMIT = 5

    const res = await userController.suggestFriend(dbContext, { id: userId })({ id: userId })
    expect(res.length).toBe(SUGGEST_LIMIT)

    const suggestedIds = res.map(u => u.id)

    for (const id of suggestedIds) {
      expect(friendIds.includes(id)).toBeFalsy()
    }

    // delete Friends
    await userModel.deleteFriend(dbContext)(userId, friendIds[0])
    await userModel.deleteFriend(dbContext)(friendIds[0], userId)

    await userModel.deleteFriend(dbContext)(userId, friendIds[1])
    await userModel.deleteFriend(dbContext)(friendIds[1], userId)

    await userModel.deleteFriend(dbContext)(userId, friendIds[2])
    await userModel.deleteFriend(dbContext)(friendIds[2], userId)

    let deletePromises = []

    for (const id of ids) {
      deletePromises.push(userModel.deleteUser(dbContext)(id))
    }

    await Promise.all(deletePromises)

  })

  it("requestFriend", async () => {
    const idA = uuid()
    const idB = uuid()
    const ucA = { id: idA }
    const ucB = { id: idB }

    const rA = await userController.createUser(dbContext, ucA)({
      input: {
        name: `t-${idA.split('-')[0]}`,
        avatarUrl: `at-${idA.split('-')[0]}`
      }
    })

    const rB = await userController.createUser(dbContext, ucB)({
      input: {
        name: `t-${idB.split('-')[0]}`,
        avatarUrl: `at-${idB.split('-')[0]}`
      }
    })

    const res = await userController.requestFriend(dbContext, ucA)({ id: idB })

    expect(res.from).toBe(idA)
    expect(res.to).toBe(idB)

    const f1 = await userModel.getFriend(dbContext)(idA, idB)
    const f2 = await userModel.getFriend(dbContext)(idB, idA)

    expect(f1).toBeDefined()
    expect(f1?.id).toBe(idB)
    expect(f1?.status).toBe("REQUESTED")
    expect(f1?.sentBy).toBe(idA)

    expect(f2).toBeDefined()
    expect(f2?.id).toBe(idA)
    expect(f2?.status).toBe("REQUESTED")
    expect(f2?.sentBy).toBe(idA)

    // clean up

    // delete friend 
    await Promise.all([
      userModel.deleteFriend(dbContext)(idA, idB),
      userModel.deleteFriend(dbContext)(idB, idA),
      userModel.deleteUser(dbContext)(idA),
      userModel.deleteUser(dbContext)(idB)
    ])
  })

  it("acceptFriend", async () => {
    // create user
    const idA = uuid()
    const idB = uuid()
    const ucA = { id: idA }
    const ucB = { id: idB }

    const rA = await userController.createUser(dbContext, ucA)({
      input: {
        name: `t-${idA.split('-')[0]}`,
        avatarUrl: `at-${idA.split('-')[0]}`
      }
    })

    const rB = await userController.createUser(dbContext, ucB)({
      input: {
        name: `t-${idB.split('-')[0]}`,
        avatarUrl: `at-${idB.split('-')[0]}`
      }
    })

    // request friend
    await userController.requestFriend(dbContext, ucA)({ id: idB })

    let fA = await userModel.getFriend(dbContext)(idA, idB)
    let fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeDefined()
    expect(fA?.id).toBe(idB)
    expect(fA?.status).toBe("REQUESTED")
    expect(fA?.sentBy).toBe(idA)

    expect(fB).toBeDefined()
    expect(fB?.id).toBe(idA)
    expect(fB?.status).toBe("REQUESTED")
    expect(fB?.sentBy).toBe(idA)

    const res = await userController.acceptFriend(dbContext, { id: idB })({ id: idA })

    expect(res.from).toBe(idB)
    expect(res.to).toBe(idA)

    fA = await userModel.getFriend(dbContext)(idA, idB)
    fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeDefined()
    expect(fA?.id).toBe(idB)
    expect(fA?.status).toBe("ACCEPTED")
    expect(fA?.sentBy).toBe(idA)

    expect(fB).toBeDefined()
    expect(fB?.id).toBe(idA)
    expect(fB?.status).toBe("ACCEPTED")
    expect(fB?.sentBy).toBe(idA)

    const c1 = await chatModel.listConversationIdsByUserId(dbContext)(idA)
    const c2 = await chatModel.listConversationIdsByUserId(dbContext)(idB)

    expect(c1.items[0]).toBe(c2.items[0])

    // clean up everything

    const conversationId = c1.items[0]
    // delete conversation
    await chatModel.deleteConversation(dbContext)(conversationId, idA)
    await chatModel.deleteConversation(dbContext)(conversationId, idB)

    // delete friend data
    await userModel.deleteFriend(dbContext)(idA, idB)
    await userModel.deleteFriend(dbContext)(idB, idA)

    // delete user
    await userModel.deleteUser(dbContext)(idA)
    await userModel.deleteUser(dbContext)(idB)
  })

  it("rejectFriend", async () => {
    const idA = uuid()
    const idB = uuid()
    const ucA = { id: idA }
    const ucB = { id: idB }

    const rA = await userController.createUser(dbContext, ucA)({
      input: {
        name: `t-${idA.split('-')[0]}`,
        avatarUrl: `at-${idA.split('-')[0]}`
      }
    })

    const rB = await userController.createUser(dbContext, ucB)({
      input: {
        name: `t-${idB.split('-')[0]}`,
        avatarUrl: `at-${idB.split('-')[0]}`
      }
    })

    await userController.requestFriend(dbContext, ucA)({ id: idB })

    let fA = await userModel.getFriend(dbContext)(idA, idB)
    let fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeDefined()
    expect(fA?.id).toBe(idB)
    expect(fA?.status).toBe("REQUESTED")
    expect(fA?.sentBy).toBe(idA)

    expect(fB).toBeDefined()
    expect(fB?.id).toBe(idA)
    expect(fB?.status).toBe("REQUESTED")
    expect(fB?.sentBy).toBe(idA)

    const res = await userController.rejectFriend(dbContext, ucB)({ id: idA })

    expect(res).toBeDefined()
    expect(res.from).toBe(idB)
    expect(res.to).toBe(idA)

    fA = await userModel.getFriend(dbContext)(idA, idB)
    fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeUndefined()
    expect(fB).toBeUndefined()

    await userModel.deleteUser(dbContext)(idA)
    await userModel.deleteUser(dbContext)(idB)
  })

  it("blockFriend", async () => {
    const idA = uuid()
    const idB = uuid()
    const ucA = { id: idA }
    const ucB = { id: idB }

    const rA = await userController.createUser(dbContext, ucA)({
      input: {
        name: `t-${idA.split('-')[0]}`,
        avatarUrl: `at-${idA.split('-')[0]}`
      }
    })

    const rB = await userController.createUser(dbContext, ucB)({
      input: {
        name: `t-${idB.split('-')[0]}`,
        avatarUrl: `at-${idB.split('-')[0]}`
      }
    })

    await userController.requestFriend(dbContext, ucA)({ id: idB })

    let fA = await userModel.getFriend(dbContext)(idA, idB)
    let fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeDefined()
    expect(fA?.id).toBe(idB)
    expect(fA?.status).toBe("REQUESTED")
    expect(fA?.sentBy).toBe(idA)

    expect(fB).toBeDefined()
    expect(fB?.id).toBe(idA)
    expect(fB?.status).toBe("REQUESTED")
    expect(fB?.sentBy).toBe(idA)

    const res = await userController.blockFriend(dbContext, ucB)({ id: idA })

    expect(res).toBeDefined()
    expect(res.from).toBe(idB)
    expect(res.to).toBe(idA)


    fA = await userModel.getFriend(dbContext)(idA, idB)
    fB = await userModel.getFriend(dbContext)(idB, idA)

    expect(fA).toBeDefined()
    expect(fA?.id).toBe(idB)
    expect(fA?.status).toBe("BLOCKED")
    expect(fA?.sentBy).toBe(idA)

    expect(fB).toBeDefined()
    expect(fB?.id).toBe(idA)
    expect(fB?.status).toBe("BLOCKED")
    expect(fB?.sentBy).toBe(idA)

    // delete friend data
    await userModel.deleteFriend(dbContext)(idA, idB)
    await userModel.deleteFriend(dbContext)(idB, idA)

    // delete user
    await userModel.deleteUser(dbContext)(idA)
    await userModel.deleteUser(dbContext)(idB)
  })
})
import { apolloClient } from "@/graphql"
import { GET_CONVERSATION_MESSAGES, LIST_CONVERSATIONS } from "@/graphql/queries"
import type { CursorPaged, ID } from "@/types"
import type { Service } from "./types"

const listConversations = async (id: ID, cursor?: string | null): Promise<CursorPaged<Service.Conversation>> => {
  const client = await apolloClient()

  const res = await client.query({
    query: LIST_CONVERSATIONS,
    variables: {
      userId: id,
      cursor
    }
  })

  if (res.errors)
    throw res.errors

  console.log("res.data.listConversations", res.data.listConversations)

  return res.data.listConversations
}

const getConversationMessages = async (conversationId: ID, cursor?: string | null): Promise<CursorPaged<Service.Message>> => {
  const client = await apolloClient()

  const res = await client.query({
    query: GET_CONVERSATION_MESSAGES,
    variables: {
      id: conversationId,
      cursor
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.getConversation
}

export default {
  listConversations,
  getConversationMessages
}
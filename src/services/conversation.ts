import { apolloClient } from "@/graphql"
import { GET_CONVERSATION, LIST_CONVERSATIONS } from "@/graphql/queries"
import type { ID } from "@/types"

const listConversations = async (id: ID) => {
  const client = await apolloClient()

  const res = await client.query({
    query: LIST_CONVERSATIONS,
    variables: {
      userId: id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.listConversations
}

const getConversation = async (idA: ID, idB: ID) => {
  const client = await apolloClient()

  const res = await client.query({
    query: GET_CONVERSATION,
    variables: {
      idA,
      idB
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.getConversation
}

export {
  listConversations,
  getConversation
}
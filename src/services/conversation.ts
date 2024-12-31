import { apolloClient } from "@/graphql"
import { GET_CONVERSATION_MESSAGES, LIST_CONVERSATIONS } from "@/graphql/queries"
import type { CursorPaged, ID } from "@/types"
import type { Service } from "./types"
import AuthService from '@/services/amplify-auth'
import { CREATE_MESSAGE } from "@/graphql/mutations"
import { ON_MESSAGE_CREATED } from "@/graphql/subscriptions"
import type { FetchResult } from "@apollo/client"

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

const createMessage = async ({ conversationId, content, contentType }:  Pick<Service.Message, "conversationId" | "content" | "contentType"> ): Promise<Service.Message> => {
  const client = await apolloClient()

  const res = await client.mutate({
    mutation: CREATE_MESSAGE,
    variables: {
      input: {
        conversationId,
        content,
        contentType
      }
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.createMessage
}

const onMessageCreated = async (
  conversationId: ID, 
  onNext: (value: FetchResult<any>) => void
): Promise<Service.Subscription> => {
  const client = await apolloClient()
  const token = await AuthService.currentIdToken()
  const res = await client.subscribe({
    query: ON_MESSAGE_CREATED,
    variables: {
      conversationId
    },
    extensions: {
      authorization: {
        host: import.meta.env.VITE_WEBSOCKET_HOST,
        Authorization: token
      }
    }
  })

  const subscription = res.subscribe({
    next: onNext,
    error: (error) => {
      throw error
    }
  })

  return subscription
}

export default {
  listConversations,
  getConversationMessages,
  createMessage,
  onMessageCreated
}
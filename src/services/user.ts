import type { Service } from './types'
import { GET_USER, LIST_USERS, SUGGEST_FRIEND } from '@/graphql/queries'
import { ACCEPT_FRIEND, CREATE_USER, REJECT_FRIEND, REQUEST_FRIEND } from '@/graphql/mutations'
import { apolloClient } from '@/graphql'
import { ON_FRIEND_REQUESTED } from '@/graphql/subscriptions'
import AuthService from '@/services/amplify-auth'
import type { FetchResult } from '@apollo/client/core'
import type { ID } from '@/types'

const listUsers = async () => {
  const client = await apolloClient()

  const res = await client.query({
    query: LIST_USERS
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const createUser = async (input: Service.CreateUserInput): Promise<Service.User> => {
  const client = await apolloClient()

  const res = await client.mutate({
    mutation: CREATE_USER,
    variables: {
      input
    }
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const getUser = async (id: string): Promise<Service.User | null> => {
  const client = await apolloClient()

  const res = await client.query({
    query: GET_USER,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.getUser
}

const suggestFriend = async (id: string) => {
  const client = await apolloClient()

  const res = await client.query({
    query: SUGGEST_FRIEND,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const requestFriend = async (id: string): Promise<ID> => {
  const client = await apolloClient()

  const res = await client.mutate({
    mutation: REQUEST_FRIEND,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data.to
}

const onFriendRequested = async (
  id: string,
  onNext: (value: FetchResult<any>) => void
): Promise<Service.Subscription> => {
  const client = await apolloClient()
  const token = await AuthService.currentIdToken()
  const res = await client.subscribe({
    query: ON_FRIEND_REQUESTED,
    variables: {
      to: id
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

const acceptFriend = async (id: ID): Promise<void> => {
  const client = await apolloClient()

  const res = await client.mutate({
    mutation: ACCEPT_FRIEND,
    variables: {
      id
    }
  })


  if (res.errors)
    throw res.errors

  console.log(res)
}

const rejectFriend = async (id: ID): Promise<void> => {
  const client = await apolloClient()

  const res = await client.mutate({
    mutation: REJECT_FRIEND,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors
}

export default {
  getUser,
  listUsers,
  createUser,
  suggestFriend,
  requestFriend,
  onFriendRequested,
  acceptFriend,
  rejectFriend
}

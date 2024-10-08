import type { Service } from './types'
import { GET_USER, LIST_USERS, SUGGEST_FRIEND } from '@/graphql/queries'
import { CREATE_USER, REQUEST_FRIEND } from '@/graphql/mutations'
import { apolloClient } from '@/graphql'

const listUsers = async () => {
  const res = await apolloClient.query({
    query: LIST_USERS
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const createUser = async (input: Service.CreateUserInput): Promise<Service.User> => {
  const res = await apolloClient.mutate({
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
  const res = await apolloClient.query({
    query: GET_USER,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const suggestFriend = async (id: string) => {
  const res = await apolloClient.query({
    query: SUGGEST_FRIEND,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const requestFriend = async (id: string) => {
  const res = await apolloClient.query({
    query: REQUEST_FRIEND,
    variables: {
      id
    }
  })

  if (res.errors)
    throw res.errors

  return res.data
}

const onFriendRequested = async () => {

}

export default {
  getUser,
  listUsers,
  createUser,
  suggestFriend,
  requestFriend
}

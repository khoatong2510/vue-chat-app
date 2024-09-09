import { client } from '@/graphql'
import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'
import type { GraphQLResult } from 'aws-amplify/api'
import type { Service } from './types'

const listUsers = async () => {
  const res = await client.graphql({
    query: queries.listUsers,
    authMode: 'userPool',
  }) as GraphQLResult<{ listtUsers: { items: Service.User[] } }>

  if (res.errors)
    throw res.errors

  return res.data.listtUsers
}

const createUser = async (input: Service.CreateUserInput) => {
  const res = await client.graphql({
    authMode: "userPool",
    query: mutations.createUser,
    variables: {
      input
    }
  }) as GraphQLResult<{ createUser: Service.User }>

  if (res.errors)
    throw res.errors

  return res.data.createUser
}

const getUser = async (id: string) => {
  const res = await client.graphql({
    authMode: "userPool",
    query: queries.getUser,
    variables: {
      id
    }
  }) as GraphQLResult<{ getUser: Service.User }>

  if (res.errors)
    throw res.errors

  return res.data.getUser
}

const suggestFriend = async (id: string) => {
  const res = await client.graphql({
    authMode: "userPool",
    query: queries.suggestFriend,
    variables: {
      id
    }
  }) as GraphQLResult<{ suggestFriend: Service.User[] }>

  console.log(res)

  if (res.errors)
    throw res.errors

  return res.data
}


export default {
  getUser,
  listUsers,
  createUser,
  suggestFriend
}

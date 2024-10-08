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
  try {
    const res = await client.graphql({
      authMode: "userPool",
      query: mutations.createUser,
      variables: {
        input
      }
    }) as GraphQLResult<any>

    if (res.errors)
      throw res.errors

    return res
  } catch (error) {
    console.log("create User", error)
  }
}

const getUser = async (id: string): Promise<Service.User | null> => {
  try {
    const res = await client.graphql({
      authMode: "userPool",
      query: queries.getUser,
      variables: {
        id
      }
    }) as GraphQLResult<{ getUser: Service.User }>

    return res.data.getUser
  } catch (error) {
    throw error
  }
}

const suggestFriend = async (id: string) => {
  const res = await client.graphql({
    authMode: "userPool",
    query: queries.suggestFriend,
    variables: {
      id
    }
  }) as GraphQLResult<{ suggestFriend: Service.User[] }>

  if (res.errors)
    throw res.errors

  return res.data
}

const requestFriend = async (id: string) => {
  // do something here

}


export default {
  getUser,
  listUsers,
  createUser,
  suggestFriend,
  requestFriend
}

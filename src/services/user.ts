import { client } from '@/graphql'
import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'
import type { CreateUserInput } from './types'

const listUsers = async () => {
  const res = await client.graphql({
    query: queries.listUsers,
    authMode: 'userPool',
  })

  console.log(res)
}

const createUser = async (input: CreateUserInput) => {
  const res = await client.graphql({
    authMode: "userPool",
    query: mutations.createUser,
    variables: {
      input
    }
  })

  console.log(res)
}

export default {
  listUsers,
  createUser
}

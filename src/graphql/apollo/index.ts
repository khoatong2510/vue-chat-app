import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, split, type NormalizedCacheObject } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import AuthService from '@/services/amplify-auth'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext(async (_, { headers }) => {
  const token = await AuthService.currentIdToken()

  return {
    headers: {
      ...headers,
      'X-Api-Key': import.meta.env.VITE_GRAPHQL_API_KEY,
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json"
  }
})



const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_GRAPHQL_REAL_TIME_ENDPOINT,
  connectionParams: {

  }
}))


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
}) 

import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient, MessageType, type Message } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import AuthService from '@/services/amplify-auth'
import { v4 as uuidv4 } from 'uuid'

const authLink = setContext(async (_, { headers }) => {
  const token = await AuthService.currentIdToken()
  return {
    headers: {
      ...headers,
      Authorization: token || ""
    }
  }
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json"
  }
})

const getWsLink = async () => {
  const token = await AuthService.currentIdToken()
  const header = btoa(JSON.stringify({
    host: import.meta.env.VITE_WEBSOCKET_HOST,
    Authorization: token
  }))
  const payload = btoa(JSON.stringify({}))

  return new GraphQLWsLink(createClient({
    url: `${import.meta.env.VITE_GRAPHQL_REAL_TIME_ENDPOINT}?header=${header}&payload=${payload}`,
    connectionParams: {},
    webSocketImpl: class extends WebSocket {
      constructor(address: URL, protocols: string[]) {
        super(address, ['graphql-ws'])
      }
    },
    jsonMessageReplacer: (key, value) => {
      if (value?.type === 'subscribe') {
        return {
          id: value.id,
          type: 'start',
          payload: {
            data: JSON.stringify({
              query: value.payload.query,
              variables: value.payload.variables
            }),
            extensions: value.payload.extensions
          },
          authorization: value.payload.extensions
        }
      }

      if (key === 'type' && value === 'complete') {
        return 'stop'
      }

      return value
    },
    jsonMessageReviver: (key, value) => {
      if ((key === 'type' && value === 'ka') || value?.type === 'ka') {
        return 'pong'
      }

      if (key === 'type' && value === 'start_ack')
        return 'pong'

      if (key === 'type' && value === 'data')
        return 'next'

      return value
    }
  }))
}

const splitLink = async () => {
  const wsLink = await getWsLink()

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
  )
}

export const apolloClient = async () => {
  const link = await splitLink()
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}  

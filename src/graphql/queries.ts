import { gql } from "@apollo/client/core"

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      avatarUrl
      friends {
        id
        sentBy
        status
      }
    }
  }
`

export const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      id
      name
      avatarUrl
      friends {
        id
        status
      }
    }
  }
`

export const SUGGEST_FRIEND = gql`
  query SuggestFriend($id: ID!) {
    suggestFriend(id: $id) {
      id
      name
      avatarUrl
      friends {
        id
        status
      }
    }
  }
`

export const LIST_CONVERSATIONS = gql`
  query ListConversations($userId: ID!) {
    listConversations(userId: $userId) {
      id
      lastMessage {
        content
        sentBy
        createdAt
      }
    }
  }
`

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
    }
  }
`
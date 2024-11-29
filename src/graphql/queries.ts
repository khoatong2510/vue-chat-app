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
  query ListConversations($userId: ID!, $cursor: String) {
    listConversations(userId: $userId, cursor: $cursor) {
      items {
        id
        members
        lastMessage {
          content
          sentBy
          createdAt
        }
        messages {
          items {
            id
            conversationId
            content
            contentType
            sentBy
            replyTo
            createdAt
            updatedAt
          }
          cursor
        }
        createdAt
      }
      cursor
    }
  }
`

export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($id: ID!) {
    getConversationMessages(id: $id) {
      items {
        id
        conversationId
        content
        contentType
        sentBy
        replyTo
        createdAt
        updatedAt
      }
      cursor
    }
  }
`
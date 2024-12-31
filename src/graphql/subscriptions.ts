import { gql } from "@apollo/client/core"

export const ON_FRIEND_REQUESTED = gql`
  subscription OnFriendRequested($to: ID!) {
    onFriendRequested(to: $to) {
      from
      to
    }
  }
`

export const ON_FRIEND_ACCEPTED = gql`
  subscription OnFriendAccepted($to: ID!) {
    onFriendAccepted(to: $to) {
      from
      to
    }
  }
`

export const ON_MESSAGE_CREATED = gql`
  subscription OnMessageCreated($conversationId: ID!) {
    onMessageCreated(conversationId: $conversationId) {
      id
      conversationId
      content
      contentType
      sentBy
      replyTo
      updatedAt
      createdAt
    }
  }
`
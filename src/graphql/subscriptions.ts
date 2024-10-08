import { gql } from "@apollo/client/core"

export const ON_FRIEND_REQUESTED = gql`
  subscription OnFriendRequested($from: ID!, $to: ID!) {
    onFriendRequested(from: $from, to: $to)
  }
`
import { gql } from "@apollo/client/core"

export const ON_FRIEND_REQUESTED = gql`
  subscription OnFriendRequested($to: ID!) {
    onFriendRequested(to: $to) {
      from
      to
    }
  }
`
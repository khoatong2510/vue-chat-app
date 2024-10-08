import { gql } from "@apollo/client/core"

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      error
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $values: UpdateUserInput) {
    updateUser(id: $id, values: $values) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

export const REQUEST_FRIEND = gql`
  mutation RequestFriend($id: ID!) {
    requestFriend(id: $id)
  }
`

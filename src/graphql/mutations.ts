/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      name
      avatarUrl
      friends {
        id
        status
      }
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($id: ID!, $values: UserInput) {
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
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
export const requestFriend = /* GraphQL */ `
  mutation RequestFriend($id: ID!) {
    requestFriend(id: $id)
  }
`;

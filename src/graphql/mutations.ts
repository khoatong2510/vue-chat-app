/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($id: ID!, $values: CreateUserInput) {
    updateUser(id: $id, values: $values) {
      id
      name
      avatarUrl
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

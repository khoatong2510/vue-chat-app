/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      avatarUrl
      friends
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      name
      avatarUrl
      friends
    }
  }
`;
export const suggestFriend = /* GraphQL */ `
  query SuggestFriend($id: ID!) {
    suggestFriend(id: $id) {
      id
      name
      avatarUrl
    }
  }
`;

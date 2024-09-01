/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id: string,
  name: string,
  avatarUrl: string,
};

export type User = {
  __typename: "User",
  id?: string,
  name?: string | null,
  avatarUrl?: string | null,
};

export type CreateUserMutationVariables = {
  input?: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    avatarUrl?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  id?: string,
  values?: CreateUserInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    avatarUrl?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  id?: string,
};

export type DeleteUserMutation = {
  deleteUser?: string | null,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    avatarUrl?: string | null,
  } | null,
};

export type ListUsersQuery = {
  listUsers?:  Array< {
    __typename: "User",
    id: string,
    name?: string | null,
  } | null > | null,
};

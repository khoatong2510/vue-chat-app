/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UserInput = {
  id: string,
  name: string,
  avatarUrl: string,
  friends?: Array< FriendInput | null > | null,
};

export type FriendInput = {
  id: string,
  status: FriendStatus,
};

export enum FriendStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  BLOCKED = "BLOCKED",
}


export type User = {
  __typename: "User",
  id?: string | null,
  name?: string | null,
  avatarUrl?: string | null,
  friends?:  Array<Friend | null > | null,
};

export type Profile = {
  __typename: "Profile",
  id?: string | null,
  name?: string | null,
  avatarUrl?: string | null,
};

export type Friend = {
  __typename: "Friend",
  id?: string,
  status?: FriendStatus,
};

export type CreateUserMutationVariables = {
  input?: UserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id?: string | null,
    name?: string | null,
    avatarUrl?: string | null,
    friends?:  Array< {
      __typename: "Friend",
      id: string,
      status: FriendStatus,
    } | null > | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  id?: string,
  values?: UserInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id?: string | null,
    name?: string | null,
    avatarUrl?: string | null,
    friends?:  Array< {
      __typename: "Friend",
      id: string,
      status: FriendStatus,
    } | null > | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  id?: string,
};

export type DeleteUserMutation = {
  deleteUser?: string | null,
};

export type RequestFriendMutationVariables = {
  id?: string,
};

export type RequestFriendMutation = {
  requestFriend?: string | null,
};

export type GetUserQueryVariables = {
  id?: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id?: string | null,
    name?: string | null,
    avatarUrl?: string | null,
    friends?:  Array< {
      __typename: "Friend",
      id: string,
      status: FriendStatus,
    } | null > | null,
  } | null,
};

export type ListUsersQuery = {
  listUsers?:  Array< {
    __typename: "User",
    id?: string | null,
    name?: string | null,
    avatarUrl?: string | null,
    friends?:  Array< {
      __typename: "Friend",
      id: string,
      status: FriendStatus,
    } | null > | null,
  } | null > | null,
};

export type SuggestFriendQueryVariables = {
  id?: string,
};

export type SuggestFriendQuery = {
  suggestFriend?:  Array< {
    __typename: "User",
    id?: string | null,
    name?: string | null,
    avatarUrl?: string | null,
    friends?:  Array< {
      __typename: "Friend",
      id: string,
      status: FriendStatus,
    } | null > | null,
  } | null > | null,
};

export type OnFriendRequestedSubscriptionVariables = {
  from?: string,
  to?: string,
};

export type OnFriendRequestedSubscription = {
  onFriendRequested?: string | null,
};

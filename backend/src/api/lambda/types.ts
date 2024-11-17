import { AppSyncIdentityCognito } from "@aws-appsync/utils"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export type AppsyncResolverEvent = {
  field: string,
  argurments: object,
  identity: AppSyncIdentityCognito
}

export type HandlerReturnType = {
  result?: object,
  error?: {
    message: string,
    name?: string
  }
}

export type Controller = {
  [key: string]: Function
}

export type DbContext = {
  dynamodb: DynamoDBClient
  chatTableName: string
}

export type UserContext = {
  id: string
}
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { bundleAppSyncResolver } from './utils'

const FUNCTIONS_DIR = './src/api/functions/'
const RESOLVERS_DIR = './src/api/resolvers/'
const SCHEMA_DIR = './src/api/'

enum ResolverTypeName {
  Query = 'Query',
  Mutation = 'Mutation'
} 

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'chat-api',
      schema: appsync.SchemaFile.fromAsset(`${SCHEMA_DIR}/schema.graphql`),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM
        }
      }
    })

    const userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const userDataSource = api.addDynamoDbDataSource('userDataSource', userTable)

    const listUserFunc = new appsync.AppsyncFunction(this, 'func-list-users', {
      name: 'list_users_func',
      api,
      dataSource: userDataSource,
      code: bundleAppSyncResolver(`${FUNCTIONS_DIR}/user/listUsers.ts`),
      runtime: appsync.FunctionRuntime.JS_1_0_0
    })

    new appsync.Resolver(this, 'pipeline-resolver-list-users', {
      api,
      typeName: ResolverTypeName.Query,
      fieldName: 'listUsers',
      code: bundleAppSyncResolver(`${RESOLVERS_DIR}/user/listUsers.ts`),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [listUserFunc]
    })


    const createUserFunc = new appsync.AppsyncFunction(this, 'func-create-user', {
      name: 'create_user_func',
      api,
      dataSource: userDataSource,
      code: bundleAppSyncResolver(`${FUNCTIONS_DIR}/user/createUser.ts`),
      runtime: appsync.FunctionRuntime.JS_1_0_0
    })

    new appsync.Resolver(this, 'pipeline-resolver-create-user', {
      api,
      typeName: ResolverTypeName.Mutation,
      fieldName: 'createUser',
      code: bundleAppSyncResolver(`${RESOLVERS_DIR}/user/createUser.ts`),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createUserFunc]
    })
    
  }
}
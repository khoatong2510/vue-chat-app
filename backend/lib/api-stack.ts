import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { ResolverConstruct } from './constructs/resolver'
import { ResolverType } from './constructs/types'

const FUNCTIONS_DIR = './out/api/functions/'
const RESOLVERS_DIR = './out/api/resolvers/'
const SCHEMA_DIR = './src/api/'

interface ApiStackProps extends cdk.StackProps {
  userPool: cognito.UserPool
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'chat-api',
      schema: appsync.SchemaFile.fromAsset(`${SCHEMA_DIR}/schema.graphql`),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.userPool
            }
          }
        ]
      },
      logConfig: {
        excludeVerboseContent: true,
        fieldLogLevel: appsync.FieldLogLevel.ALL
      }
    })

    const userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const userDataSource = api.addDynamoDbDataSource('userDataSource', userTable)

    new ResolverConstruct(this, 'list-users-resolver', {
      api,
      dataSource: userDataSource,
      fieldName: 'listUsers',
      resolverId: 'pipeline-resolver-list-users',
      resolverFilePath: `${RESOLVERS_DIR}/user/listUsers.js`,
      resolverType: ResolverType.Query
    })

    new ResolverConstruct(this, 'create-user-resolver', {
      api,
      dataSource: userDataSource,
      fieldName: 'createUser',
      resolverId: 'pipeline-resolver-create-user',
      resolverFilePath: `${RESOLVERS_DIR}/user/createUser.js`,
      resolverType: ResolverType.Mutation,
      functionId: 'func-create-user',
      functionName: 'create_user_func',
      functionFilePath: `${FUNCTIONS_DIR}/user/createUser.js`
    })

    new ResolverConstruct(this, 'update-user-resolver', {
      api,
      dataSource: userDataSource,
      fieldName: 'updateUser',
      resolverId: 'pipeline-resolver-update-user',
      resolverFilePath: `${RESOLVERS_DIR}/user/updateUser.js`,
      resolverType: ResolverType.Mutation,
      functionId: 'func-update-user',
      functionName: 'update_user_func',
      functionFilePath: `${FUNCTIONS_DIR}/user/updateUser.js`
    })

    new ResolverConstruct(this, 'delete-user-resolver', {
      api,
      dataSource: userDataSource,
      fieldName: 'deleteUser',
      resolverId: 'pipeline-resolver-delete-user',
      resolverFilePath: `${RESOLVERS_DIR}/user/deleteUser.js`,
      resolverType: ResolverType.Mutation,
      functionId: 'func-delete-user',
      functionName: 'delete_user_func',
      functionFilePath: `${FUNCTIONS_DIR}/user/deleteUser.js`
    })
  }
}
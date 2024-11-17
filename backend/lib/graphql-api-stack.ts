import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as iam from 'aws-cdk-lib/aws-iam'
const SCHEMA_DIR = '../'

interface GraphqlApiStackProps extends cdk.StackProps {
  userPool: cognito.UserPool
}

export class GraphqlApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GraphqlApiStackProps) {
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

    const chatTable = new dynamodb.Table(this, 'dynamodb-chat-table', {
      tableName: 'ChatTable',
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING
      }
    })

    chatTable.addLocalSecondaryIndex({
      indexName: 'message-by-timestamp-lsi',
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.NUMBER
      }
    })

    chatTable.addGlobalSecondaryIndex({
      indexName: 'reverse-index',
      partitionKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING
      }
    })

    const fields = [
      { typeName: 'Query', fieldName: 'getUser' },
      { typeName: 'Query', fieldName: 'suggestFriend' },
      { typeName: 'Query', fieldName: 'listConversations' },
      { typeName: 'Query', fieldName: 'getConversation' },
      { typeName: 'Mutation', fieldName: 'createUser' },
      { typeName: 'Mutation', fieldName: 'deleteUser' },
      { typeName: 'Mutation', fieldName: 'updateUser' },
      { typeName: 'Mutation', fieldName: 'requestFriend' },
      { typeName: 'Mutation', fieldName: 'acceptFriend' },
      { typeName: 'Mutation', fieldName: 'rejectFriend' },
      { typeName: 'Mutation', fieldName: 'blockFriend' },
      { typeName: 'Mutation', fieldName: 'createMessage' },
      { typeName: 'Mutation', fieldName: 'updateMessage' },
      { typeName: 'Mutation', fieldName: 'deleteMessage' }
    ]

    const lambdaRole = new iam.Role(this, 'lambda-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'resolver-lambda-role'
    })

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:*Item",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      resources: [
        chatTable.tableArn
      ]
    }))

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:PutLogEventsBatch',
      ],
      resources: [
        '*'
      ]
    }))

    const lambdaFunction = new lambda.Function(this, 'resolver-lambda-function', {
      functionName: "ResolverLambda",
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(`./zip/lambda.zip`),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(10),
      memorySize: 512,
      environment: {
        CHAT_TABLE: chatTable.tableName
      }
    })

    const appsyncRole = new iam.Role(this, 'appsync-role', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
      roleName: 'appsync-role'
    })

    appsyncRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "lambda:InvokeFunction"
      ],
      resources: [
        lambdaFunction.functionArn
      ]
    }))

    const lambdaDataSource = new appsync.LambdaDataSource(this, 'chat-app-lambda-data-source', {
      name: 'chatapplambdadatasource',
      api,
      lambdaFunction,
      description: "resolver lambda function",
      serviceRole: appsyncRole
    })

    for (const field of fields) {
      lambdaDataSource.createResolver(`${field.fieldName}-resolver`, {
        code: appsync.Code.fromAsset(`./out/resolver/resolver.js`),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
        ...field,
      })
    }
  }
}
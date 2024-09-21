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

    const userTable = new dynamodb.Table(this, 'dynamodb-user-table', {
      tableName: 'UserTable',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    })

    const fields = [
      { typeName: 'Query', fieldName: 'listUsers' },
      { typeName: 'Query', fieldName: 'getUser' },
      { typeName: 'Query', fieldName: 'suggestFriend' },
      { typeName: 'Mutation', fieldName: 'createUser' },
      { typeName: 'Mutation', fieldName: 'deleteUser' },
      { typeName: 'Mutation', fieldName: 'updateUser' },
      { typeName: 'Mutation', fieldName: 'requestFriend' },

    ]

    // const functionMap = userFunctions.reduce((a: Map<string, appsync.AppsyncFunction>, c: string) => {
    //   const func = new appsync.AppsyncFunction(this, fromCamelToKebab(`${c}-func`), {
    //     name: `${c}Func`,
    //     api,
    //     dataSource: userDataSource,
    //     code: appsync.Code.fromAsset(`${FUNCTIONS_DIR}/user/${c}.js`),
    //     runtime: appsync.FunctionRuntime.JS_1_0_0
    //   })

    //   if (!a.get(c))
    //     a.set(c, func)

    //   return a
    // }, new Map<string, appsync.AppsyncFunction>())

    // const getPipeline = (names: string[]): appsync.AppsyncFunction[] => {
    //   return names.map(p => {
    //     const func = functionMap.get(p)

    //     if (!func)
    //       throw Error("function not found")

    //     return func
    //   })
    // }

    // for (const query of userResolvers.queries) {
    //   const pipeline = getPipeline(query.pipeline)

    //   new appsync.Resolver(this, fromCamelToKebab(`${query.name}-resolver`), {
    //     api,
    //     typeName: ResolverType.Query,
    //     fieldName: `${query.name}`,
    //     code: appsync.Code.fromAsset(`${RESOLVERS_DIR}/user/${query.name}.js`),
    //     runtime: appsync.FunctionRuntime.JS_1_0_0,
    //     pipelineConfig: pipeline
    //   })
    // }

    // for (const mutation of userResolvers.mutations) {
    //   const pipeline = getPipeline(mutation.pipeline)

    //   new appsync.Resolver(this, fromCamelToKebab(`${mutation.name}-resolver`), {
    //     api,
    //     typeName: ResolverType.Mutation,
    //     fieldName: `${mutation.name}`,
    //     code: appsync.Code.fromAsset(`${RESOLVERS_DIR}/user/${mutation.name}.js`),
    //     runtime: appsync.FunctionRuntime.JS_1_0_0,
    //     pipelineConfig: pipeline
    //   })
    // }

    const lambdaRole = new iam.Role(this, 'lambda-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'resolver-lambda-role'
    })

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:*Item",
        "dynamodb:Query"
      ],
      resources: [
        userTable.tableArn
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
      role: lambdaRole
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
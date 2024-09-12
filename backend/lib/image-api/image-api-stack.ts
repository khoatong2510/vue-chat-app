import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'
import getRequestIntegration from './get-request-intergration'
import putRequestIntegration from './put-request-integration'
import * as logs from 'aws-cdk-lib/aws-logs'


interface ImageUploadApiStackProps extends cdk.StackProps {
  userPool: cognito.UserPool
}

export class ImageUploadApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ImageUploadApiStackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'avatar-bucket-2', {
      bucketName: 'avatar-2',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })


    // create role
    const role = new iam.Role(this, 'api-gateway-s3-proxy-policy', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      roleName: 'APIGatewayS3ProxyPolicy',
    })

    role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
        's3:PutObject',
        's3:ListBucket',

      ],
      resources: [
        bucket.bucketArn,
        bucket.arnForObjects("*"),
      ]
    }))

    // const logRole = new iam.Role(this, 'cloudwatch-log-role', {
    //   assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    //   roleName: 'CloudwatchLog'
    // })

    // logRole.addToPolicy(new iam.PolicyStatement({
    //   effect: iam.Effect.ALLOW,
    //   actions: [
    //     'logs:PutLogEvents',
    //     'logs:PutLogEventsBatch',
    //     'logs:CreateLogStream'
    //   ],
    //   resources: [
    //     logGroup.logGroupArn

    //   ]
    // }))

    // create api resources to represent s3 resources


    // expose an api method to list the caller's s3 buckets
    const api = new apigateway.RestApi(this, 'avatar-api', {
      restApiName: 'avatar-api',
      binaryMediaTypes: ["image/*"],
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS
      }
    })

    // api.root.addMethod('ANY')

    const avatarRoot = api.root.addResource('avatar')
    const avatar = avatarRoot.addResource('{id}')

    const getIntegration = getRequestIntegration(props, role)
    const putIntegration = putRequestIntegration(props, role)


    const auth = new apigateway.CognitoUserPoolsAuthorizer(this, 'api-authorizer', {
      cognitoUserPools: [props.userPool]
    })

    avatar.addMethod('GET', getIntegration, {
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      requestParameters: {
        "method.request.path.id": true,
        "method.request.header.Accept": true
      },
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Timestamp": true,
            "method.response.header.Content-Length": true,
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Methods": true
          },
        },
        {
          statusCode: '400'
        },
        {
          statusCode: '500'
        }
      ]
    })

    avatar.addMethod('PUT', putIntegration, {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: auth,
      requestParameters: {
        "method.request.path.id": true,
        "method.request.header.Content-Type": true
      },
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Methods": true
          }
        },
        {
          statusCode: '400'
        },
        {
          statusCode: '500'
        }
      ]
    })

    const deployment = new apigateway.Deployment(this, 'api-deployment', {
      api,
      description: "API to upload image to S3 bucket"
    })

    deployment.addToLogicalId(api.latestDeployment?.deploymentId)
    const logGroup = new logs.LogGroup(this, 'DevLogs', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY
    })

    new apigateway.Stage(this, 'dev', {
      deployment: deployment,
      stageName: "dev",
      // accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
      // accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
      //   caller: false,
      //   httpMethod: true,
      //   ip: true,
      //   protocol: true,
      //   requestTime: true,
      //   resourcePath: true,
      //   responseLength: true,
      //   status: true,
      //   user: true,
      // }),
    })
  }
}
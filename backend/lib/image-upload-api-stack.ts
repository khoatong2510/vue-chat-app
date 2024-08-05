import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

interface ImageUploadApiStackProps extends cdk.StackProps {
  userPool: cognito.UserPool
}

export class ImageUploadApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ImageUploadApiStackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'avatar-bucket-2', {
      bucketName: 'avatar-2',
      removalPolicy: cdk.RemovalPolicy.DESTROY
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
        's3:ListBucket'
      ],
      resources: [
        bucket.bucketArn, 
        bucket.arnForObjects("*")
      ]
    }))

    // create api resources to represent s3 resources


    // expose an api method to list the caller's s3 buckets


    const api = new apigateway.RestApi(this, 'avatar-api', {
      restApiName: 'avatar-api',
      binaryMediaTypes: ["image/*"],
    })

    // api.root.addMethod('ANY')
    
    const avatarRoot = api.root.addResource('avatar')
    const avatar = avatarRoot.addResource('{id}')
    

    const getIntegration = new apigateway.AwsIntegration({
      service: 's3',
      region: props.env?.region || 'ap-southeast-2',
      path: 'avatar-2/{object}',
      integrationHttpMethod: 'GET',
      options: {
        credentialsRole: role,
        requestParameters: {
          "integration.request.path.object": "method.request.path.id",
          "integration.request.header.Accept": "method.request.header.Accept"
        },
        integrationResponses: [
          {
            statusCode: '200',
            contentHandling: apigateway.ContentHandling.CONVERT_TO_BINARY,
            responseParameters: {
              "method.response.header.Content-Type": "integration.response.header.Content-Type",
              "method.response.header.Date": "integration.response.header.Date",
              "method.response.header.Content-Length": "integration.response.header.Content-Length"
            }
          },
          {
            statusCode: '400'
          },
          {
            statusCode: '403'
          },
          {
            statusCode: '404'
          },
          {
            statusCode: '500'
          }
        ]
      }
    })

    const putIntegration = new apigateway.AwsIntegration({
      service: 's3',
      region: props.env?.region || 'ap-southeast-2',
      path: 'avatar-2/{object}',
      integrationHttpMethod: 'PUT',
      options: {
        credentialsRole: role,
        requestParameters: {
          "integration.request.path.object": "method.request.path.id",
        },
        integrationResponses: [
          {
            statusCode: '200',
            // contentHandling: apigateway.ContentHandling.CONVERT_TO_TEXT,
            // responseParameters: {
              // "method.response.header.Content-Type": "application/json",
              // "method.response.header.Date": "integration.response.header.Date",
              // "method.response.header.Content-Length": "integration.response.header.Content-Length"
            // },
            // responseTemplates: {
            //   "application/json": `{ "message": "File Uploaded" }`,
            // }
          },
          {
            statusCode: '400'
          },
          {
            statusCode: '403'
          },
          {
            statusCode: '404'
          },
          {
            statusCode: '500'
          }
        ]
      }
    })

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
            "method.response.header.Date": true,
            "method.response.header.Content-Length": true,
          }
        },
        {
          statusCode: '400'
        },
        {
          statusCode: '404',
        },
        {
          statusCode: '403'
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
        "method.request.path.id": true
      },
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            "method.response.header.Content-Type": true,
            // "method.response.header.Date": true,
            // "method.response.header.Content-Length": true,
          }
        }
      ]
    })

    const deployment = new apigateway.Deployment(this, 'api-deployment', { 
      api,
      description: "API to upload image to S3 bucket" 
    })

    new apigateway.Stage(this, 'dev', {
      deployment,
      stageName: "dev"
    })
  }
}
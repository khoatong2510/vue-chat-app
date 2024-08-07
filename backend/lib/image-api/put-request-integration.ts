import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

const putRequestIntegration = (props: cdk.StackProps, credentialsRole: iam.Role) => {
  const integration = new apigateway.AwsIntegration({
    service: 's3',
    region: props.env?.region || 'ap-southeast-2',
    path: 'avatar-2/{object}',
    integrationHttpMethod: 'PUT',
    options: {
      credentialsRole,
      requestParameters: {
        "integration.request.path.object": "method.request.path.id",
      },
      integrationResponses: [
        {
          statusCode: '200',
          selectionPattern: `2\\d{2}`,
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": "'Content-Type'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT'"
          }
        },
        {
          statusCode: '400',
          selectionPattern: '4\\d{2}',
          responseTemplates: {
            "application/json": `{ "message": "Error uploading file" }`
          }
        },
        {
          statusCode: '500',
          selectionPattern: '5\\d{2}',
          responseTemplates: {
            "application/json": `{ "message": "Internal Server Error" }`
          }
        }
      ]
    }
  })
  return integration
}

export default putRequestIntegration
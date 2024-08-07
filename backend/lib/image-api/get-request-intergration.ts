import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

const getRequestIntegration = (props: cdk.StackProps, credentialsRole: iam.Role) => { 
  const integration = new apigateway.AwsIntegration({
    service: 's3',
    region: props.env?.region || 'ap-southeast-2',
    path: 'avatar-2/{object}',
    integrationHttpMethod: 'GET',
    options: {
      credentialsRole,
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
          statusCode: '400',
          selectionPattern: `4\\d{2}`,
          responseTemplates: {
            "application/json": `{ "message": "Error while fetching file" }`
          }
        },
      
        {
          statusCode: '500',
          selectionPattern: `5\\d{2}`,
          responseTemplates: {
            "application/json": `{ "message": "Internal Server Error" }`
          }
        }
      ]
    }
  })

  return integration
}

export default getRequestIntegration
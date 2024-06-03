import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const authChallengeFunction = new lambda.Function(this, 'authChallengeFunction', {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset('@/auth/auth-challenge.ts')

    // })

    new cognito.UserPool(this, 'chat-userpool', {
      userPoolName: 'chatapp-userpool',
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email to our app',
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      autoVerify: {
        email: true
      },
      keepOriginal: {
        email: true
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(3)
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    })
  }
}

import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as cognito from 'aws-cdk-lib/aws-cognito'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const authChallengeFunction = new lambda.Function(this, 'authChallengeFunction', {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset('@/auth/auth-challenge.ts')

    // })

    const userPool = new cognito.UserPool(this, 'chat-userpool', {
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
      deletionProtection: true
    })

    const clientWriteAttributes = (new cognito.ClientAttributes())
      .withStandardAttributes({ email: true })

    const clientReadAttributes = (new cognito.ClientAttributes())
      .withStandardAttributes({ emailVerified: true })

    userPool.addClient('chatapp-userpool-client', {
      userPoolClientName: 'chatapp-userpool-client',
      authFlows: {
        userPassword: true,
      },
      idTokenValidity: cdk.Duration.minutes(60),
      accessTokenValidity: cdk.Duration.minutes(60),
      refreshTokenValidity: cdk.Duration.days(30),
      authSessionValidity: cdk.Duration.minutes(3),
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes
    })

    userPool.addDomain('userpool-domain', {
      cognitoDomain: {
        domainPrefix: "my-chatapp"
      }
    })

    this.userPool = userPool
  }
}

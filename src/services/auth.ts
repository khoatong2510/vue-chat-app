import {
  CognitoIdentityProvider,
  SignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand
} from '@aws-sdk/client-cognito-identity-provider'
import type { Service } from './types'

const clientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID

const client = new CognitoIdentityProvider({
  region: import.meta.env.VITE_AWS_REGION
})

const signUp = async ({ email, password }: Service.AuthInput) => {
  const command = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  })

  return await client.send(command)
}

// login
const initiateAuth = async ({ email, password }: Service.AuthInput) => {
  const command = new InitiateAuthCommand({
    ClientId: clientId,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  })

  return await client.send(command)
}

// signout
const signOut = async (accessToken: string) => {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken
  })

  return await client.send(command)
}


export default {
  initiateAuth,
  signUp,
  signOut
}

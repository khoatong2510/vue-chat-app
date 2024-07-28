#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AuthStack } from '../lib/auth-stack'
import { ApiStack } from '../lib/api-stack'

const app = new cdk.App()
const env = { 
  account: process.env.CDK_DEFAULT_ACCOUNT, 
  region: process.env.CDK_DEFAULT_REGION 
}

const authStack = new AuthStack(app, 'AuthStack', {
  env
})

new ApiStack(app, 'ApiStack', { 
  userPool: authStack.userPool,
  env
})
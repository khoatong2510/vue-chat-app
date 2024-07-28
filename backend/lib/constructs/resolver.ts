import { Construct } from 'constructs'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import { bundleAppSyncResolver } from '../utils'
import { ResolverConstructProps } from './types'

export class ResolverConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ResolverConstructProps) {
    super(scope, id);

    let appsyncFunction = undefined
    if (props.functionId && props.functionName && props.functionFilePath) {
      appsyncFunction = new appsync.AppsyncFunction(scope, props.functionId, {
        name: props.functionName,
        api: props.api,
        dataSource: props.dataSource,
        code: appsync.Code.fromAsset(props.functionFilePath),
        runtime: appsync.FunctionRuntime.JS_1_0_0
      })
    }
    
    const resolverProps ={
      api: props.api,
      dataSource: appsyncFunction ? undefined : props.dataSource,
      typeName: props.resolverType,
      fieldName: props.fieldName,
      code: appsync.Code.fromAsset(props.resolverFilePath),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: appsyncFunction ? [appsyncFunction] : undefined
    }

    new appsync.Resolver(scope, props.resolverId, resolverProps)
  }
}
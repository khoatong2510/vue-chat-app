import * as appsync from 'aws-cdk-lib/aws-appsync'

export enum ResolverType {
  Query = 'Query',
  Mutation = 'Mutation'
}

export type ResolverConstructProps = {
  api: appsync.GraphqlApi,
  dataSource: appsync.DynamoDbDataSource,
  functionId?: string,
  functionName?: string,
  functionFilePath?: string
  resolverId: string,
  fieldName: string
  resolverType: ResolverType,
  resolverFilePath: string
}
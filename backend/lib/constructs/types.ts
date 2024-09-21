import * as appsync from 'aws-cdk-lib/aws-appsync'

export enum ResolverType {
  Query = 'Query',
  Mutation = 'Mutation'
}

export type ResolverConstructProps = {
  api: appsync.GraphqlApi,
  dataSource: appsync.DynamoDbDataSource,
  resolverId: string,
  fieldName: string
  resolverType: ResolverType,
  resolverFilePath: string
}
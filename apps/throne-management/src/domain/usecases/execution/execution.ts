export interface ExecutionParams {
  integrationId: string;
  pathParams?: object;
  queryParams?: object;
  headers?: object;
  request?: object;
}

export interface Execution {
  execute: (params: ExecutionParams) => Promise<any>;
}

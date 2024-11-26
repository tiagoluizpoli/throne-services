declare module 'amazon-user-pool-srp-client' {
  export class SRPClient {
    constructor(userPoolId: string)
    calculateA(): string
  }
}

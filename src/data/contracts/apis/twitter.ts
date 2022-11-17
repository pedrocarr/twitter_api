export interface LoadTwitterUserApi {
  loadUser: (params: LoadTwitterUserApi.Params) => Promise<LoadTwitterUserApi.Result>
}

export namespace LoadTwitterUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    name: string
    email: string
    twitterId: string
  }
}

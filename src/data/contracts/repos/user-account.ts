export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<void>

}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
}

export interface CreateTwitterAccountRepository {
  createFromTwitter: (params: CreateTwitterAccountRepository.Params) => Promise<void>

}

export namespace CreateTwitterAccountRepository {
  export type Params = {
    email: string
    name: string
    twitterId: string
  }
}

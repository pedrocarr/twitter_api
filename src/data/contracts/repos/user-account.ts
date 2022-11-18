export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>

}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
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

export interface UpdateTwitterAccountRepository {
  updateWithTwitter: (params: UpdateTwitterAccountRepository.Params) => Promise<void>

}

export namespace UpdateTwitterAccountRepository {
  export type Params = {
    id: string
    name: string
    twitterId: string
  }
}

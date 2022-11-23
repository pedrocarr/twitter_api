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

export interface SaveTwitterAccountRepository {
  saveWithTwitter: (params: SaveTwitterAccountRepository.Params) => Promise<SaveTwitterAccountRepository.Result>
}

export namespace SaveTwitterAccountRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    twitterId: string
  }

  export type Result = {
    id: string
  }
}

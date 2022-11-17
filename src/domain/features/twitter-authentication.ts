import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

export interface TwitterAuthentication {
  perform: (params: TwitterAuthentication.Params) => Promise<TwitterAuthentication.Result>
}

export namespace TwitterAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}

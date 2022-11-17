import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'

export class TwitterAuthenticationService {
  constructor (
    private readonly loadTwitterUserApi: LoadTwitterUserApi
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    await this.loadTwitterUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

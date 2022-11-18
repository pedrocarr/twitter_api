import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { CreateTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

export class TwitterAuthenticationService {
  constructor (
    private readonly loadTwitterUserApi: LoadTwitterUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createTwitterAccountRepo: CreateTwitterAccountRepository
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.loadTwitterUserApi.loadUser(params)
    if (twitterData !== undefined) {
      await this.loadUserAccountRepo.load({ email: twitterData.email })
      await this.createTwitterAccountRepo.createFromTwitter(twitterData)
    }
    return new AuthenticationError()
  }
}

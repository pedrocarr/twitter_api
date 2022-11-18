import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { CreateTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

export class TwitterAuthenticationService {
  constructor (
    private readonly twitterApi: LoadTwitterUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateTwitterAccountRepository
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.twitterApi.loadUser(params)
    if (twitterData !== undefined) {
      await this.userAccountRepo.load({ email: twitterData.email })
      await this.userAccountRepo.createFromTwitter(twitterData)
    }
    return new AuthenticationError()
  }
}

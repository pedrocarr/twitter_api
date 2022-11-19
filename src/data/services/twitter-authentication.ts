import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { SaveTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { TwitterAccount } from '@/domain/models/twitter-account'

export class TwitterAuthenticationService {
  constructor (
    private readonly twitterApi: LoadTwitterUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveTwitterAccountRepository
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.twitterApi.loadUser(params)
    if (twitterData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: twitterData.email })
      const twitterAccount = new TwitterAccount(twitterData, accountData)
      await this.userAccountRepo.saveWithTwitter(twitterAccount)
    }
    return new AuthenticationError()
  }
}

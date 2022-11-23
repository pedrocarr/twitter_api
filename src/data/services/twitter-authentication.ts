import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/data/contracts/crypto'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { SaveTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { TwitterAccount } from '@/domain/models/twitter-account'
import { AccessToken } from '@/domain/models/access-token'

export class TwitterAuthenticationService {
  constructor (
    private readonly twitterApi: LoadTwitterUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveTwitterAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.twitterApi.loadUser(params)
    if (twitterData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: twitterData.email })
      const twitterAccount = new TwitterAccount(twitterData, accountData)
      const { id } = await this.userAccountRepo.saveWithTwitter(twitterAccount)
      await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}

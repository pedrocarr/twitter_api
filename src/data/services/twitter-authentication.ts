import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { SaveTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

export class TwitterAuthenticationService {
  constructor (
    private readonly twitterApi: LoadTwitterUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveTwitterAccountRepository
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.twitterApi.loadUser(params)
    if (twitterData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: twitterData.email })
      await this.userAccountRepo.saveWithTwitter({
        id: accountData?.id,
        name: accountData?.name ?? twitterData.name,
        email: twitterData.email,
        twitterId: twitterData.twitterId
      })
    }
    return new AuthenticationError()
  }
}

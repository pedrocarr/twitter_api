import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { CreateTwitterAccountRepository, LoadUserAccountRepository, UpdateTwitterAccountRepository } from '@/data/contracts/repos'

export class TwitterAuthenticationService {
  constructor (
    private readonly twitterApi: LoadTwitterUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateTwitterAccountRepository & UpdateTwitterAccountRepository
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    const twitterData = await this.twitterApi.loadUser(params)
    if (twitterData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: twitterData.email })
      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithTwitter({
          id: accountData.id,
          name: accountData.name ?? twitterData.name,
          twitterId: twitterData.twitterId
        })
      } else {
        await this.userAccountRepo.createFromTwitter(twitterData)
      }
    }
    return new AuthenticationError()
  }
}

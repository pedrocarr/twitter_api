import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { SaveTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { TwitterAccount } from '@/domain/models/twitter-account'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/twitter-account')

describe('TwitterAuthenticationService', () => {
  let twitterApi: MockProxy<LoadTwitterUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveTwitterAccountRepository>
  let sut: TwitterAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    twitterApi = mock()
    twitterApi.loadUser.mockResolvedValue({
      name: 'any_twitter_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new TwitterAuthenticationService(
      twitterApi,
      userAccountRepo
    )
  })
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    await sut.perform({ token })

    expect(twitterApi.loadUser).toHaveBeenCalledWith({ token })
    expect(twitterApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    twitterApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })
  it('should call LoadUserAccountRepo when LoadTwitterUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_twitter_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveTwitterAccountRepository with TwitterAccount', async () => {
    const TwitterAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(TwitterAccount).mockImplementation(TwitterAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledTimes(1)
  })
})

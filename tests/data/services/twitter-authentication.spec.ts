import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { SaveTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

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
  it('should create account with twitter data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledWith({
      email: 'any_twitter_email',
      name: 'any_twitter_name',
      twitterId: 'any_twitter_id'
    })
    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledTimes(1)
  })
  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledTimes(1)
  })
  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_twitter_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
    expect(userAccountRepo.saveWithTwitter).toHaveBeenCalledTimes(1)
  })
})

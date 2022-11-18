import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { CreateTwitterAccountRepository, LoadUserAccountRepository, UpdateTwitterAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('TwitterAuthenticationService', () => {
  let twitterApi: MockProxy<LoadTwitterUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateTwitterAccountRepository & UpdateTwitterAccountRepository>
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

  it('should return LoadUserAccountRepo when LoadTwitterUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_twitter_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return CreateTwitterAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(userAccountRepo.createFromTwitter).toHaveBeenCalledWith({
      email: 'any_twitter_email',
      name: 'any_twitter_name',
      twitterId: 'any_twitter_id'
    })
    expect(userAccountRepo.createFromTwitter).toHaveBeenCalledTimes(1)
  })

  it('should return UpdateTwitterAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateWithTwitter).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      twitterId: 'any_twitter_id'
    })
    expect(userAccountRepo.updateWithTwitter).toHaveBeenCalledTimes(1)
  })
})

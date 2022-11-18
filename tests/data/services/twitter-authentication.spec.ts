import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { CreateTwitterAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('TwitterAuthenticationService', () => {
  let loadTwitterUserApi: MockProxy<LoadTwitterUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createTwitterAccountRepo: MockProxy<CreateTwitterAccountRepository>
  let sut: TwitterAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadTwitterUserApi = mock()
    loadTwitterUserApi.loadUser.mockResolvedValue({
      name: 'any_twitter_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
    loadUserAccountRepo = mock()
    createTwitterAccountRepo = mock()
    sut = new TwitterAuthenticationService(
      loadTwitterUserApi,
      loadUserAccountRepo,
      createTwitterAccountRepo
    )
  })
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    await sut.perform({ token })

    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    loadTwitterUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should return LoadUserAccountRepo when LoadTwitterUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_twitter_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(createTwitterAccountRepo.createFromTwitter).toHaveBeenCalledWith({
      email: 'any_twitter_email',
      name: 'any_twitter_name',
      twitterId: 'any_twitter_id'
    })
    expect(createTwitterAccountRepo.createFromTwitter).toHaveBeenCalledTimes(1)
  })
})

import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { mock, MockProxy } from 'jest-mock-extended'

describe('TwitterAuthenticationService', () => {
  let loadTwitterUserApi: MockProxy<LoadTwitterUserApi>
  let sut: TwitterAuthenticationService

  beforeEach(() => {
    loadTwitterUserApi = mock()
    sut = new TwitterAuthenticationService(loadTwitterUserApi)
  })
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    loadTwitterUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

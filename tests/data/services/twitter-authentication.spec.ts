import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const loadTwitterUserApi = {
      loadUser: jest.fn()
    }
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    const loadTwitterUserApi = {
      loadUser: jest.fn()
    }
    loadTwitterUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

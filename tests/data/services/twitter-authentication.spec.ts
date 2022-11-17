import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const loadTwitterUserApi = mock<LoadTwitterUserApi>()
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    const loadTwitterUserApi = mock<LoadTwitterUserApi>()
    loadTwitterUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

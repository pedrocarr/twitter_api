import { AuthenticationError } from '@/domain/errors'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { TwitterAuthenticationService } from '@/data/services'

class LoadTwitterUserApiSpy implements LoadTwitterUserApi {
  token?: string
  callsCount = 0
  result = undefined
  async loadUser (params: LoadTwitterUserApi.Params): Promise<LoadTwitterUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const loadTwitterUserApi = new LoadTwitterUserApiSpy()
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.token).toBe('any_token')
    expect(loadTwitterUserApi.callsCount).toBe(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    const loadTwitterUserApi = new LoadTwitterUserApiSpy()
    loadTwitterUserApi.result = undefined
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

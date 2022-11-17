import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthentication } from '@/domain/features'
import { LoadTwitterUserApi } from '@/data/contracts/apis'

class TwitterAuthenticationService {
  constructor (
    private readonly loadTwitterUserApi: LoadTwitterUserApi
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<AuthenticationError> {
    await this.loadTwitterUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

class LoadTwitterUserApiSpy implements LoadTwitterUserApi {
  token?: string
  result = undefined
  async loadUser (params: LoadTwitterUserApi.Params): Promise<LoadTwitterUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const loadTwitterUserApi = new LoadTwitterUserApiSpy()
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    const loadTwitterUserApi = new LoadTwitterUserApiSpy()
    loadTwitterUserApi.result = undefined
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

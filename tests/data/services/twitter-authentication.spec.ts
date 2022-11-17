import { TwitterAuthentication } from '@/domain/features'

class TwitterAuthenticationService {
  constructor (
    private readonly loadTwitterUserApi: LoadTwitterUserApi
  ) {}

  async perform (params: TwitterAuthentication.Params): Promise<void> {
    await this.loadTwitterUserApi.loadUser(params)
  }
}

interface LoadTwitterUserApi {
  loadUser: (params: LoadTwitterUserApi.Params) => Promise<void>
}

namespace LoadTwitterUserApi {
  export type Params = {
    token: string
  }
}

class LoadTwitterUserApiSpy implements LoadTwitterUserApi {
  token?: string
  async loadUser (params: LoadTwitterUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const loadTwitterUserApi = new LoadTwitterUserApiSpy()
    const sut = new TwitterAuthenticationService(loadTwitterUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.token).toBe('any_token')
  })
})

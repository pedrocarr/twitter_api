import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

class TwitterApi {
  private readonly baseUrl = 'https://api.twitter.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadTwitterUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/authorize`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

describe('TwitterApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new TwitterApi(httpClient, clientId, clientSecret)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://api.twitter.com/oauth/authorize',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})

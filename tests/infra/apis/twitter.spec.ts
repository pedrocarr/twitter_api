import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

class TwitterApi {
  private readonly baseUrl = 'https://api.twitter.com'

  constructor (private readonly httpClient: HttpGetClient) {}

  async loadUser (params: LoadTwitterUserApi.Params): Promise<void> {
    await this.httpClient.get({ url: `${this.baseUrl}/oauth/authorize` })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('TwitterApi', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new TwitterApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://api.twitter.com/oauth/authorize'
    })
  })
})

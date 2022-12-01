import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '@/infra/http'

export class TwitterApi {
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

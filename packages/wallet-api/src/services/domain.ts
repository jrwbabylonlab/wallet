import { HttpClient } from '../client/http-client'

export class DomainService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get domain information
   */
  async getDomainInfo(domain: string) {
    return this.httpClient.get('/v5/address/search', { query: { domain } })
  }
}

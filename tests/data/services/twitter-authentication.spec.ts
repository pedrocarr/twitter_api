import { AuthenticationError } from '@/domain/errors'
import { TwitterAuthenticationService } from '@/data/services'
import { LoadTwitterUserApi } from '@/data/contracts/apis'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: TwitterAuthenticationService
  loadTwitterUserApi: MockProxy<LoadTwitterUserApi>
}

const makeSut = (): SutTypes => {
  const loadTwitterUserApi = mock<LoadTwitterUserApi>()
  const sut = new TwitterAuthenticationService(loadTwitterUserApi)
  return { sut, loadTwitterUserApi }
}

describe('TwitterAuthenticationService', () => {
  it('should call LoadTwitterUserApi with the correct parameters', async () => {
    const { sut, loadTwitterUserApi } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadTwitterUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadTwitterUserApi returns undefined', async () => {
    const { sut, loadTwitterUserApi } = makeSut()
    loadTwitterUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

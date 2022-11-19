import { TwitterAccount } from '@/domain/models/twitter-account'

describe('TwitterAccount', () => {
  const twitterData = {
    name: 'any_twitter_name',
    email: 'any_twitter_email',
    twitterId: 'any_twitter_id'
  }

  it('should create with Twitter data only', () => {
    const sut = new TwitterAccount(twitterData)

    expect(sut).toEqual({
      name: 'any_twitter_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new TwitterAccount(twitterData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_twitter_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new TwitterAccount(twitterData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_twitter_email',
      twitterId: 'any_twitter_id'
    })
  })
})

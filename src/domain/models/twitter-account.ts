type TwitterData = { name: string, email: string, twitterId: string }
type AccountData = { id?: string, name?: string }

export class TwitterAccount {
  id?: string
  name: string
  email: string
  twitterId: string

  constructor (twitterData: TwitterData, accountData?: AccountData) {
    this.id = accountData?.id
    this.name = accountData?.name ?? twitterData.name
    this.email = twitterData.email
    this.twitterId = twitterData.twitterId
  }
}

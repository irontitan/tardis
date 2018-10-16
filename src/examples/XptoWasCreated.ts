import crypto from 'crypto'
import Event from '../classes/Event'
import Reducer from '../classes/Reducer'

function createId (): string {
  return crypto.randomBytes(12).toString('hex')
}

class Xpto {
  name: string | null = null
  updatedAt: Date | null = null
  updatedBy: string | null = null

  static create (name: string, user: string) {
    return [
      new XptoWasCreated({ name }, user)
    ]
  }

  public get state () {
    return {
      name: this.name,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    }
  }
}

class XptoWasCreated extends Event {
  static eventName = 'xpto-was-created'
  user: string

  constructor (data: any, user: string) {
    super(createId(), 'xpto-was-created', data)
    this.user = user
  }

  static commit (state: Xpto, event: XptoWasCreated): Xpto {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

const xptoReducer = new Reducer<Xpto>({
  [XptoWasCreated.eventName]: XptoWasCreated.commit
})

const xpto = xptoReducer.reduce(new Xpto(), Xpto.create('John Doe', 'johndoe'))
console.log(xpto.state) // { name: 'John Doe', updatedBy: 'johndoe', updatedAt: 2018-10-16T20:54:57.122Z }

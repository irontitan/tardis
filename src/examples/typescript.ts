import crypto from 'crypto'
import Event from '../classes/Event'
import Reducer from '../classes/Reducer'

function createId (): string {
  return crypto.randomBytes(12).toString('hex')
}

class Person {
  name: string | null = null
  email: string | null = null
  updatedAt: Date | null = null
  updatedBy: string | null = null

  static create (name: string, user: string, email: string) {
    return [
      new PersonWasCreated({ name }, user),
      new PersonEmailWasAdded({ email }, user)
    ]
  }

  public get state () {
    return {
      name: this.name,
      email: this.email,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    }
  }
}

class PersonWasCreated extends Event {
  static eventName = 'person-was-created'
  user: string

  constructor (data: { name: string }, user: string) {
    super(createId(), PersonWasCreated.eventName, data)
    this.user = user
  }

  static commit (state: Person, event: PersonWasCreated): Person {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

class PersonEmailWasAdded extends Event {
  static eventName = 'person-email-was-added'
  user: string

  constructor (data: { email: string }, user: string) {
    super(createId(), PersonEmailWasAdded.eventName, data)
    this.user = user
  }

  static commit (state: Person, event: PersonEmailWasAdded): Person {
    state.email = event.data.email
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

const personReducer = new Reducer<Person>({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonEmailWasAdded.eventName]: PersonEmailWasAdded.commit
})

const events = [
  ...Person.create('John Doe', 'johndoe', 'john.doe@company.com')
]

console.log(events)

const person = personReducer.reduce(new Person(), events)
/*
[
  PersonWasCreated {
    id: 'd043fc61a0ab5e088a458b6b',
    name: 'person-was-created',
    data: { name: 'John Doe' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  },
  PersonEmailWasAdded {
    id: 'a2707db386e25529e25ee882',
    name: 'person-email-was-added',
    data: { email: 'john.doe@company.com' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  }
]
*/

console.log(person.state)
/*
{
  name: 'John Doe',
  email: 'john.doe@company.com',
  updatedBy: 'johndoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/

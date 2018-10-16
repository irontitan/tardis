'use strict'

const crypto = require('crypto')
const { Event, Reducer } = require('../../dist')

function createId () {
  return crypto.randomBytes(12).toString('hex')
}

class Person {
  constructor () {
    this.name = null
    this.email = null
    this.updatedAt = null
    this.updatedBy = null
  }

  static create (name, user, email) {
    return [
      new PersonWasCreated({ name }, user),
      new PersonEmailWasAdded({ email }, user)
    ]
  }
  get state () {
    return { ...this }
  }
}

class PersonWasCreated extends Event {
  constructor (data, user) {
    super(createId(), PersonWasCreated.eventName, data)
    this.user = user
  }

  static get eventName () { return 'person-was-created' }

  static commit (state, event) {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

class PersonEmailWasAdded extends Event {
  constructor (data, user) {
    super(createId(), PersonEmailWasAdded.eventName, data)
    this.user = user
  }

  static get eventName () { return 'person-email-was-added' }

  static commit (state, event) {
    state.email = event.data.email
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

const personReducer = new Reducer({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonEmailWasAdded.eventName]: PersonEmailWasAdded.commit
})

const events = [
  ...Person.create('John Doe', 'johdoe', 'john.doe@company.com')
]

console.log(events)
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

const person = personReducer.reduce(new Person(), events)

console.log(person.state)
/*
{
  name: 'John Doe',
  email: 'john.doe@company.com',
  updatedBy: 'johndoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/


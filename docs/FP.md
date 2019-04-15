## Functional style usage

Functional code is available by requiring `@nxcd/tardis/functional`. Core concepts of this style will be explained below.

### Javascript

> Person.js

```js
const PersonWasCreated = require('./PersonWasCreatedEvent')
const PersonEmailWasAdded = require('./PersonEmailWasAddedEvent')

function create (name, email, user) {
  return [
    PersonWasCreated.create({ name }, user),
    PersonEmailWasAdded.create({ email }, user)
  ]
}

module.exports = { create }
```

> PersonWasCreatedEvent.js

```js
const { createEventFactory } = require('@nxcd/tardis/functional')

const EVENT_NAME = 'person-was-created'

const factory = createEventFactory(EVENT_NAME)

const create = (data, user) => ({
  ...factory(data),
  user
})

const commit = (state, event) => ({
  ...state,
  name: event.data.name,
  updatedAt: event.timestamp,
  updatedBy: event.user
})

module.exports = {
  name: EVENT_NAME,
  create,
  commit
}
```

> PersonEmailWasAddedEvent.js

```js
const { createEventFactory } = require('@nxcd/tardis/functional')

const EVENT_NAME = 'person-email-was-added'

const factory = createEventFactory(EVENT_NAME)

const create = (data, user) => ({
  ...factory(data),
  user
})

const commit = (state, event) => ({
  ...state,
  email: event.data.email,
  updatedAt: event.timestamp,
  updatedBy: event.user
})

module.exports = {
  name: EVENT_NAME,
  create,
  commit
}
```

> index.js

```js
const Person = require('./Person')
const PersonWasCreated = require('./PersonWasCreatedEvent')
const { createReducer } = require('@nxcd/tardis/functional')
const PersonEmailWasAdded = require('./PersonEmailWasAddedEvent')

const personReducer = createReducer({
  [PersonWasCreated.name]: PersonWasCreated.commit,
  [PersonEmailWasAdded.name]: PersonEmailWasAdded.commit
})

const events = [ ...Person.create('John Doe', 'jdoe', 'john.doe@company.com') ]
console.log(events)
/*
[
  {
    id: 'd043fc61a0ab5e088a458b6b'
    name: 'person-was-created',
    data: { name: 'John Doe' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  },
  {
    id: 'a2707db386e25529e25ee882',
    name: 'person-email-was-added',
    data: { email: 'john.doe@company.com' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  }
]
*/

const personState = personReducer.reduce({}, events)
console.log(personState)
/*
{
  name: 'John Doe',
  email: 'john.doe@company.com',
  updatedBy: 'johndoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/
```

### Typescript:

> Person.ts

```ts
import PersonWasCreated from './PersonWasCreatedEvent'
import PersonEmailWasAdded from './PersonEmailWasAddedEvent'

export type PersonState = {
  name: string
  email: string | null
  updatedAt: Date
  updatedBy: string
}

function create = (name: string, user: string, email: string) {
  return [
    PersonWasCreated.create({ name }, user),
    PersonEmailWasAdded.create({ email }, user)
  ]
}

export default { create }
```

> PersonWasCreatedEvent.ts

```ts
import { createEventFactory, CommitFunction } from '@nxcd/tardis/functional'

export type PersonCreationParams = {
  name: string
}

const EVENT_NAME = 'person-was-created'

const factory = createEventFactory(EVENT_NAME)

const create = (data: PersonCreationParams, user: string) => ({
  ...factory(data),
  user
})

const commit: CommitFunction<PersonCreationParams, PersonState> = (state, event) => ({
  ...state,
  name: event.data.name,
  updatedAt: event.timestamp,
  updatedBy: event.user
})

export default {
  name: EVENT_NAME,
  create,
  commit
}
```

> PersonEmailWasAddedEvent.ts

```ts
import { createEventFactory, CommitFunction } from '@nxcd/tardis/functional'

const EVENT_NAME = 'person-email-was-added'

const factory = createEventFactory(EVENT_NAME)

const create = (params: { email: string }, user: string) => ({
  ...factory(params),
  user
})

const commit: CommitFunction<{ email: string }, PersonState> = (state, event) => ({
  ...state,
  email: event.data.email,
  updatedAt: event.timestamp,
  updatedBy: event.user
})

export default {
  name: EVENT_NAME,
  create,
  commit
}
```

> index.ts

```ts
import Person, { PersonState } from './Person'
import PersonWasCreated from './PersonWasCreatedEvent'
import { createReducer } from '@nxcd/tardis/functional'
import PersonEmailWasAdded from './PersonEmailWasAddedEvent'

const personReducer = createReducer<PersonState>({
  [PersonWasCreated.name]: PersonWasCreated.commit,
  [PersonEmailWasAdded.name]: PersonEmailWasAdded.commit
})

const events = [ ...Person.create('John Doe', 'jdoe', 'john.doe@company.com') ]
console.log(events)
/*
[
  {
    id: 'd043fc61a0ab5e088a458b6b',
    name: 'person-was-created',
    data: { name: 'John Doe' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  },
  {
    id: 'a2707db386e25529e25ee882',
    name: 'person-email-was-added',
    data: { email: 'john.doe@company.com' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'johndoe'
  }
]
*/

const personState = personReducer.reduce(new Person(), events)
console.log(personState)
/*
{
  name: 'John Doe',
  email: 'john.doe@company.com',
  updatedBy: 'johndoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/
```

## Core concepts

The core idea behind Tardis is to implement a generic and easy-to-use interface to interact with the [Event Sourcing architecture](https://martinfowler.com/eaaDev/EventSourcing.html).

In this architecture there are two core concepts: The **Event** and the **Reducer**, and we'll call anything from our business logic **Entity**, it can be a car, a person, a ship or anything else.

<div style='width: 100%; text-align: center;'>
  <img style='margin: 0 auto;' src='./assets/tardis-logo.png' width="450" height="250"/>
</div>

> Event sourcing library to help developers abstract core concepts

[![Build Status](https://travis-ci.org/nxcd/tardis.svg?branch=master)](https://travis-ci.org/nxcd/tardis)
[![GitHub license](https://img.shields.io/github/license/nxcd/tardis.svg)](https://github.com/nxcd/tardis/blob/master/LICENSE)
[![Javascript code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Github All Releases](https://img.shields.io/github/downloads/nxcd/tardis/total.svg)](https://github.com/nxcd/tardis)
[![GitHub package version](https://img.shields.io/github/package-json/v/nxcd/tardis.svg)](https://github.com/nxcd/tardis) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/506aa959a662461193b1d65e34225016)](https://www.codacy.com/app/khaosdoctor/tardis?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nxcd/tardis&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/nxcd/tardis/badge.svg?targetFile=package.json)](https://snyk.io/test/github/nxcd/tardis?targetFile=package.json)


## Summary
<!-- TOC -->

- [Summary](#summary)
- [Instalation](#instalation)
- [Usage](#usage)
  - [Functional Style](#functional-style)
  - [Javascript:](#javascript)
  - [Typescript:](#typescript)
- [Core concepts](#core-concepts)
  - [Event](#event)
    - [Events with custom ID's](#events-with-custom-ids)
  - [Reducer](#reducer)

<!-- /TOC -->

## Instalation

Simply run

**NPM:**
```bash
$ npm install @nxcd/tardis
```

**Yarn:**
```bash
$ yarn add @nxcd/tardis
```

## Usage

### Functional Style

Since version 2.1.0, tardis supports being used in functional style code. Since things are quite different, we've decied to create another file for this kind of usage. Just follow the link below:

[Functional usage](docs/FP.md)

### Javascript:

> Person.js

```js
const PersonWasCreated = require('./PersonWasCreatedEvent')
const PersonEmailWasAdded = require('./PersonEmailWasAddedEvent')

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

module.exports = Person
```

> PersonWasCreatedEvent.js

```js
const { Event } = require('@nxcd/tardis')

class PersonWasCreated extends Event {
  static get eventName () { return 'person-was-created' }

  constructor (data, user) {
    super(PersonWasCreated.eventName, data)
    this.user = user
  }

  static commit (state, event) {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

module.exports = PersonWasCreated
```

> PersonEmailWasAddedEvent.js

```js
const { Event } = require('@nxcd/tardis')

class PersonEmailWasAdded extends Event {
  static get eventName () { return 'person-email-was-added' }

  constructor (data, user) {
    super(PersonEmailWasAdded.eventName, data)
    this.user = user
  }

  static commit (state, event) {
    state.email = event.data.email
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}

module.exports = PersonEmailWasAdded
```

> index.js

```js
const { Reducer } = require('@nxcd/tardis')
const Person = require('./Person')
const PersonWasCreated = require('./PersonWasCreatedEvent')
const PersonEmailWasAdded = require('./PersonEmailWasAddedEvent')

const personReducer = new Reducer({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonEmailWasAdded.eventName]: PersonEmailWasAdded.commit
})

const events = [ ...Person.create('John Doe', 'jdoe', 'john.doe@company.com') ]
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
```

### Typescript:

> Person.ts

```ts
import PersonWasCreated from './PersonWasCreatedEvent'
import PersonEmailWasAdded from './PersonEmailWasAddedEvent'

export default class Person {
  name: string | null = null
  email: string | null = null
  updatedAt: Date | null = null
  updatedBy: string | null = null

  static create(name: string, user: string, email: string) {
    return [
      new PersonWasCreated({ name }, user),
      new PersonEmailWasAdded({ email }, user)
    ]
  }

  public get state() {
    return {
      name: this.name,
      email: this.email,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    }
  }
}
```

> PersonWasCreatedEvent.ts

```ts
import { Event } from '@nxcd/tardis'

export interface IPersonCreationParams {
  name: string
}

export default class PersonWasCreated extends Event<IPersonCreationParams> {
  static eventName = 'person-was-created'
  user: string

  constructor(data: IPersonCreationParams, user: string) {
    super(PersonWasCreated.eventName, data)
    this.user = user
  }

  static commit(state: Person, event: PersonWasCreated): Person {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

> PersonEmailWasAddedEvent.ts

```ts
import { Event } from '@nxcd/tardis'

export default class PersonEmailWasAdded extends Event<any> {
  static eventName = 'person-email-was-added'
  user: string

  constructor(data: { email: string }, user: string) {
    super(PersonEmailWasAdded.eventName, data)
    this.user = user
  }

  static commit(state: Person, event: PersonEmailWasAdded): Person {
    state.email = event.data.email
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

> index.ts

```ts
import { Reducer } from '@nxcd/tardis'
import Person from './Person'
import PersonWasCreated from './PersonWasCreatedEvent'
import PersonEmailWasAdded from './PersonEmailWasAddedEvent'

const personReducer = new Reducer<Person>({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonEmailWasAdded.eventName]: PersonEmailWasAdded.commit
})

const events = [ ...Person.create('John Doe', 'jdoe', 'john.doe@company.com') ]
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
```

## Core concepts

The core idea behind Tardis is to implement a generic and easy-to-use interface to interact with the [Event Sourcing architecture](https://martinfowler.com/eaaDev/EventSourcing.html).

In this architecture there are two core concepts: The **Event** and the **Reducer**, and we'll call anything from our business logic **Entity**, it can be a car, a person, a ship or anything else.

### Event

An event represents something that happened to your entity. For instance "The Person was created at the database", or even "The person has visited Amsterdam" and so on. Every event receives two arguments: The event name string (lowercase and hyphenated, so `Person was created` becomes `person-was-created`), and all the data for that event. It also contains a `timestamp` and an `id` property which will be automatically generated.

All events must also include **a static `name` property** and **a static `commit` method**. The commit method is a function with the following signature:

```js
static commit (state, event) {

}
```

The `commit` method is where the state will be updated and sent back to the reducer.

Let's say we have this entity:

```js
const { PersonWasCreated } = require('../your/path/to/events')

class Person {
  constructor () {
    this.name = null
    this.updatedBy = null
    this.updatedAt = null
  }

  // This method will return every event needed to create the user
  static create (name, user) {
    return [
      new PersonWasCreated({ name }, user)
    ]
  }

  get state () {
    return { ...this }
  }
}
```

So, let's construct an Event:

**Typescript**:

```ts
import { Event } from '@nxcd/tardis'

class PersonWasCreated extends Event { // Our event's class
  static eventName = 'person-was-created' // Event name
  public user: string // A custom user property belonging to the event itself

  // The event constructor takes as many arguments as your event needs
  // In our case, we only have two: The data which is related to the entity "Person" and the user who generated the event
  constructor (data: { name: string }, user: string) {
    super(PersonWasCreated.eventName, data) // Calling the parent class with the name and entity data
    this.user = user
  }

  // Commit method which will update the current received state
  // State is an instance of your own entity with all the properties you need
  // Our entity has only the property "name"
  static commit (state: Person, event: PersonWasCreated) {
    // Updating the state
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

**Javascript**

```js
const { Event } = require('@nxcd/tardis')

class PersonWasCreated extends Event {
  static get eventName () { return 'person-was-created' }

  constructor (data, user) {
    super(PersonWasCreated.eventName, data)
    this.user = user
  }

  static commit (state, event) {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

#### Events with custom ID's

By default, the Event class will generate a MongoDB-Like ObjectID. If you wish to use your own ID function, then it is needed to supply it to the third optional parameter in the `super` method inside your event:

**Typescript**

```ts
import { Event } from '@nxcd/tardis'
import crypto from 'crypto'

function createId (): string {
  return crypto.randomBytes(12).toString('hex')
}

class PersonWasCreated extends Event {
  static eventName = 'person-was-created'
  public user: string

  constructor (data: { name: string }, user: string) {
    super(PersonWasCreated.eventName, data, createId())
    this.user = user
  }

  static commit (state: Person, event: PersonWasCreated) {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

**Javascript**

```js
const crypto = require('crypto')
const { Event } = require('@nxcd/tardis')

function createId () {
  return crypto.randomBytes(12).toString('hex')
}

class PersonWasCreated extends Event {
  static get eventName () { return 'person-was-created' }

  constructor (data, user) {
    super(PersonWasCreated.eventName, data, createId())
    this.user = user
  }

  static commit (state, event) {
    state.name = event.data.name
    state.updatedAt = event.timestamp
    state.updatedBy = event.user
    return state
  }
}
```

### Reducer

The reducer is a structure that represents the applied state. It will be the reducer which will receive an initial state and recursively apply all the `commit` functions present in events, passing the resulting state to the initial state of the next call, essentially, reducing an array of events to a single final event.

All reducers must be instantiated by passing an object of known events and it's respective commit functions, for instance, let's get our Person's events:

**Typescript**

```ts
import { Person } from './your/entity/path'
import { Reducer } from '@nxcd/tardis'
import { PersonWasCreated, PersonWasUpdated } from './your/path/to/events'

const personReducer = new Reducer<Person>({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonWasUpdated.eventName]: PersonWasUpdated.commit
})
```

**Javascript**

```js
const { Person } = require('./your/entity/path')
const { Reducer } = require('@nxcd/tardis')
const { PersonWasCreated, PersonWasUpdated } = require('./your/path/to/events')

const personReducer = new Reducer({
  [PersonWasCreated.eventName]: PersonWasCreated.commit,
  [PersonEmailWasAdded.eventName]: PersonEmailWasAdded.commit
})
```

Now we have an instance of the reducer which will only apply commits to that specific known events. Now we can create an event and pass to it so it will update our entity:

**Typescript**

```ts
import { Person } from './your/entity/path'
import { Reducer } from '@nxcd/tardis'
import { PersonWasCreated, PersonWasUpdated } from './your/path/to/events'

const events = [...Person.create('John Doe', 'jdoe')]

console.log(events)
/*
[
  PersonWasCreated {
    id: 'd043fc61a0ab5e088a458b6b',
    name: 'person-was-created',
    data: { name: 'John Doe' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'jdoe'
  }
]
*/

let initialState = new Person()
console.log(initialState.state)
/*
{
  name: null
  updatedBy: null
  updatedAt: null
}
*/

const person = personReducer.reduce(initialState, events)
console.log(person.state)
/*
{
  name: 'John Doe',
  updatedBy: 'jdoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/
```

**Javascript**

```js
const { Person } = require('./your/entity/path')
const { Reducer } = require('@nxcd/tardis')
const { PersonWasCreated, PersonWasUpdated } = require('./your/path/to/events')

const events = [...Person.create('John Doe', 'jdoe')]

console.log(events)
/*
[
  PersonWasCreated {
    id: 'd043fc61a0ab5e088a458b6b',
    name: 'person-was-created',
    data: { name: 'John Doe' },
    timestamp: 2018-10-16T22:10:06.022Z,
    user: 'jdoe'
  }
]
*/

let initialState = new Person()
console.log(initialState.state)
/*
{
  name: null
  updatedBy: null
  updatedAt: null
}
*/

const person = personReducer.reduce(initialState, events)
console.log(person.state)
/*
{
  name: 'John Doe',
  updatedBy: 'jdoe',
  updatedAt: 2018-10-16T20:54:57.122Z
}
*/
```

import ObjectId from 'bson-objectid'
import { Event } from '../../../src/functional/Event'
import { ShipDockedEvent, ShipWasCreatedEvent } from './events'

type Entity<State extends { id: Id }, Id = ObjectId> = {
  _id: Id
  events: Event<any>[],
  state: State
}

export type ShipType = 'A' | 'B' | 'C'

export type ShipState = {
  id: ObjectId
  name: string
  type: ShipType
  createdAt: Date,
  port: string | null,
  lastDockedAt: Date | null
}

export type Ship = Entity<ShipState>

function create (id: ObjectId, name: string, type: ShipType): Ship {
  const shipWasCreatedEvent = ShipWasCreatedEvent.create({ name, type, id })

  return {
    _id: id,
    events: [shipWasCreatedEvent],
    state: ShipWasCreatedEvent.commit({}, shipWasCreatedEvent)
  }
}

function dock (ship: Ship, port: string, user: string): Ship {
  const shipDockedEvent = ShipDockedEvent.create({ port }, user)

  return {
    _id: ship._id,
    events: [...ship.events, shipDockedEvent],
    state: ShipDockedEvent.commit(ship.state, shipDockedEvent)
  }
}

export const ShipManager = {
  create,
  dock
}

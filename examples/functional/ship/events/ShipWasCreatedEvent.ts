import ObjectId from 'bson-objectid'
import { ShipType, ShipState } from '../Ship'
import { CommitFunction, createEventFactory } from '../../../../functional' // Outside tardis, this would be '@nxcd/tardis/functional'

const EVENT_NAME = 'ship-was-created'

type ShipWasCreatedEventData = {
  id: ObjectId
  name: string
  type: ShipType
}

export const create = createEventFactory<ShipWasCreatedEventData>(EVENT_NAME)

export const commit: CommitFunction<ShipWasCreatedEventData, ShipState> = (state: {}, event) => {
  return {
    ...state,
    id: event.data.id,
    name: event.data.name,
    type: event.data.type,
    createdAt: event.timestamp,
    port: null,
    lastDockedAt: null
  }
}

export const ShipWasCreatedEvent = {
  name: EVENT_NAME,
  create,
  commit
}

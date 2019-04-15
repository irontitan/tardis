import { ShipState } from '../Ship'
import { createEventFactory, CommitFunction } from '../../../../functional' // Outside tardis, this would be '@nxcd/tardis/functional'

const EVENT_NAME = 'ship-docked'

type ShipDockedEventData = {
  port: string
}

const factory = createEventFactory<ShipDockedEventData>(EVENT_NAME)

export const create = (params: ShipDockedEventData, user: string) => ({ ...factory(params), user })

export const commit: CommitFunction<ShipDockedEventData, ShipState> = (state: ShipState, event) => {
  return {
    ...state,
    port: event.data.port,
    lastDockedAt: event.timestamp
  }
}

export const ShipDockedEvent = {
  name: EVENT_NAME,
  create,
  commit
}

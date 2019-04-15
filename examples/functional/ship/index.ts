import ObjectId from 'bson-objectid'
import { ShipManager, Ship } from './Ship'
import { createReducer } from '../../../functional' // Outside tardis, this would be '@nxcd/tardis/functional'
import { ShipWasCreatedEvent, ShipDockedEvent } from './events'

/**
 * Using ship manager (eg. creating new)
 */
const ship = ShipManager.create(new ObjectId(), 'Pérola Negra', 'A')
const dockedShip = ShipManager.dock(ship, 'Seattle', 'rjmunhoz')

console.log(dockedShip.state)
// {
//   id: ObjectID { id: [Getter] },
//   name: 'Pérola Negra',
//   type: 'A',
//   createdAt: 2019-04-14T12:32:57.193Z,
//   port: 'Seattle',
//   lastDockedAt: 2019-04-14T12:32:57.194Z
// }


/**
 * Using reducer (eg. reading from database)
 */
const reducer = createReducer({
  [ShipWasCreatedEvent.name]: ShipWasCreatedEvent.commit,
  [ShipDockedEvent.name]: ShipDockedEvent.commit
})

const eventsFromDatabase = [
  ShipWasCreatedEvent.create({ id: new ObjectId(), name: 'Pérola Negra', type: 'A' }),
  ShipDockedEvent.create({ port: 'Seattle' }, 'rjmunhoz')
]

const shipState = reducer.reduce({}, eventsFromDatabase)

const reducedShip: Ship = {
  _id: shipState.id,
  state: shipState,
  events: eventsFromDatabase
}

console.log(reducedShip.state)
// {
//   id: ObjectID { id: [Getter] },
//   name: 'Pérola Negra',
//   type: 'A',
//   createdAt: 2019-04-14T12:32:57.193Z,
//   port: 'Seattle',
//   lastDockedAt: 2019-04-14T12:32:57.194Z
// }

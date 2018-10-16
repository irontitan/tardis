import IEvent from '../interfaces/IEvent'
import ICommitFunction from '../interfaces/ICommitFunction'
import cloneDeep from 'lodash.clonedeep'

export default class Reducer<EntityInterface> {
  private knownEvents: { [key: string]: ICommitFunction<EntityInterface, any> }

  constructor(knownEvents: { [key: string]: ICommitFunction<EntityInterface, any> }) {
    this.knownEvents = knownEvents
  }

  reduce (state: EntityInterface, events: IEvent[]): EntityInterface {
    return events.reduce<EntityInterface>((state: EntityInterface, event: IEvent) => {
      const clonedState = cloneDeep(state)
      return this.knownEvents[event.name](clonedState, event)
    }, state)
  }
}

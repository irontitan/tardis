import IEvent from '../interfaces/IEvent'
import ICommitFunction from '../interfaces/ICommitFunction'

export default class Reducer<EntityInterface> {
  private knownEvents: { [key: string]: ICommitFunction<EntityInterface, any> }

  constructor(knownEvents: { [key: string]: ICommitFunction<EntityInterface, any> }) {
    this.knownEvents = knownEvents
  }

  reduce (state: EntityInterface, events: IEvent[]): EntityInterface {
    return events.reduce<EntityInterface>((state: EntityInterface, event: IEvent) => {
      return this.knownEvents[event.name](state, event)
    }, state)
  }
}

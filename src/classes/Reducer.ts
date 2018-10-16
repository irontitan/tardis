import IEvent from "../interfaces/IEvent"
import IReducer from "../interfaces/IReducer"

export default class Reducer<I> implements IReducer<I> {
  private knownEvents: IEvent<I>[]

  constructor(knownEvents: IEvent<I>[]) {
    this.knownEvents = knownEvents
  }

  get(name: string): IEvent<I> {
    const event = this.knownEvents.find(predicate)
  }
  reduce(state: I, events: IEvent<I>[]): I {
    throw new Error('Method not implemented.');
  }
}
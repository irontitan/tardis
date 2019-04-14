import { Event, CommitFunction } from './Event'

type EventMap<State> = {
  [ key: string ]: CommitFunction<any, State>
}

type Reducer<State> = {
  (state: any, events: Event<any>[]): State
}

export function createReducer<State> (knownEvents: EventMap<State>) {
  const reduce: Reducer<State> = (state, events) =>{
    return events.reduce<State>((state, event) => {
      const commit = knownEvents[event.name]

      if (!commit) throw new Error(`Unknown event ${event.name}`)

      return commit(state, event)
    }, state)
  }

  return { reduce }
}

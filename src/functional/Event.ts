import ObjectId from 'bson-objectid'

export type Event<TData> = {
  readonly id: string
  readonly name: string
  readonly data: TData
  readonly timestamp: Date
}

export type EventFactory<TData> = {
  (data: TData, id?: string): Event<TData>
}

export type CommitFunction<TData, State> = {
  (state: any, event: Event<TData>): State
}

export function createEventFactory<TData> (name: string): EventFactory<TData> {
  return (data: TData, id?: string): Event<any> => {
    const _id = id || new ObjectId().toHexString()
    const timestamp = new Date()

    const event = {
      get id () { return _id },
      get name () { return name } ,
      get data () { return data },
      get timestamp () { return timestamp }
    }

    return event
  }
}

import { IEvent } from '../interfaces/IEvent'
import ObjectId from 'bson-objectid'

export class Event<TData> implements IEvent<TData> {
  id: string
  name: string
  data: TData
  timestamp: Date

  constructor(name: string, data: TData, id?: string) {
    this.id = id || new ObjectId().toHexString()
    this.name = name
    this.data = data
    this.timestamp = new Date()
  }
}

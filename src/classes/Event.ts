import { IEvent } from '../interfaces/IEvent'
import ObjectId from 'bson-objectid'

export class Event implements IEvent {
  readonly id: string
  readonly name: string
  readonly data: any
  readonly timestamp: Date

  constructor(name: string, data: any, id?: string) {
    this.id = id || new ObjectId().toHexString()
    this.name = name
    this.data = data
    this.timestamp = new Date()
  }
}
import IEvent from '../interfaces/IEvent'

export default class Event implements IEvent {
  id: string
  name: string
  data: any
  timestamp: Date

  constructor (id: string, name: string, data: any) {
    this.id = id
    this.name = name
    this.data = data
    this.timestamp = new Date()
  }
}


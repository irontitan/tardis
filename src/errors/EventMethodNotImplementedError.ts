export default class EventMethodNotImplementedError extends Error{
  constructor (methodName: string, eventName: string) {
    super(`Method '${methodName}' not implemented for event '${eventName}'`)
    this.name = 'EventMethodNotImplementedError'
  }
}

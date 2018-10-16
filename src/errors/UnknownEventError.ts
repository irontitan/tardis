export default class UnknownEventError extends Error {
  constructor (name: string) {
    super(`Unknown event '${name}'`)
    this.name = 'UnknownEventError'
  }
}

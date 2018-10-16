export default interface IEvent<Interface> {
  name: string
  reduce(state: Interface, data: any, metadata: { timestamp: Date, [ key: string ]: any }): Interface
}
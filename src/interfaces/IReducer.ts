import IEvent from '../interfaces/IEvent'

export default interface IReducer<Interface> {
  get(name: string): IEvent<Interface>
  reduce(state: Interface, events: IEvent<Interface>[]): Interface
}
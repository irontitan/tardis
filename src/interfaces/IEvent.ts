export interface IEvent<TData> {
  id: string
  name: string,
  data: TData,
  timestamp: Date
}

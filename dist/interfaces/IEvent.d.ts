export default interface IEvent<T> {
    name: string;
    reduce(state: T): any;
}

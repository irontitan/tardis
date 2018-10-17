export interface ICommitFunction<Entity, Event> {
  (state: Entity, event: Event): Entity
}

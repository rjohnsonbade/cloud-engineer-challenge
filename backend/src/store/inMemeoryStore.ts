import type { TodoList, TodoStore } from "../app";

export function createInMemoryStore(todos?: TodoList): TodoStore {
  const map = new Map(todos?.map(todo => [todo.id, todo]));

  return {
    delete: (id) => map.delete(id),
    get: (id) => map.get(id),
    set: (id, todo) => map.set(id, todo),
    list() {
      return Array.from(map.values());
    },
  }

}

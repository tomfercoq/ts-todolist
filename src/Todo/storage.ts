import type { Todo } from "./todo";

function get(): Todo[] {
  const todos = window.localStorage.getItem("todos");

  if (typeof todos === "string") {
    return JSON.parse(todos);
  }

  return [];
}

function set(todos: Todo[]) {
  window.localStorage.setItem("todos", JSON.stringify(todos));
}

export default {
  get,
  set,
};

import { FilterType, getType, renderFilters } from "./filters";
import Storage from "./storage";

export type Todo = {
  id: number;
  value: string;
  completed: boolean;
};

type TodoId = Todo["id"];

type TodoParams = {
  value: string;
  completed?: boolean;
};

let todos: Todo[] = [];

export function createTodo(params: TodoParams) {
  const { value, completed = false } = params;

  if (!value.trim()) {
    return;
  }

  todos = [...todos, { id: generateId(), value, completed }];

  renderList();
}

function filteredTodos(): Todo[] {
  const filterType = getType();

  if (filterType === FilterType.active) {
    return todos.filter((todo) => !todo.completed);
  } else if (filterType === FilterType.completed) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

export function updateTodo(id: TodoId, params: Partial<TodoParams>) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return { ...todo, ...params };
    }

    return todo;
  });

  renderList();
}

export function deleteTodo(id: TodoId) {
  todos = todos.filter((todo) => todo.id !== id);

  renderList();
}

export function renderList(initalTodos: Todo[] | undefined = undefined) {
  if (initalTodos) {
    todos = initalTodos;
  }

  renderFilters(todos);

  const elements = document.querySelectorAll("li[data-todo]");

  elements.forEach(function (el) {
    const id = Number.parseInt(el.getAttribute("data-todo") || "");

    if (!exist(id)) {
      el.remove();
    }
  });

  filteredTodos().forEach(function (todo) {
    const el = document.querySelector(`li[data-todo="${todo.id}"]`);

    if (!el) {
      renderTodo(todo);
    } else {
      const check = el.querySelector<HTMLInputElement>(".todo__item__check");
      const label = el.querySelector<HTMLLabelElement>(
        ".todo__item__label > label"
      );

      if (check && check.checked !== todo.completed) {
        check.checked = todo.completed;
      }

      if (label && label.innerText !== todo.value) {
        label.innerText = todo.value;
      }
    }
  });

  Storage.set(todos);
}

function handleEdit(id: TodoId, value: string): boolean {
  value = value.trim();

  if (value === "") {
    return false;
  }

  updateTodo(id, { value });

  return true;
}

function renderTodo(todo: Todo) {
  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = todo.completed;
  check.classList.add("todo__item__check");
  check.addEventListener("change", () =>
    updateTodo(todo.id, { completed: check.checked })
  );

  const labelLabel = document.createElement("label");
  labelLabel.innerText = todo.value;
  labelLabel.addEventListener("dblclick", function () {
    labelInput.value = this.innerText;
    labelInput.style.display = "block";
    labelInput.focus();
  });

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.value = todo.value;
  labelInput.addEventListener("blur", function () {
    if (!handleEdit(todo.id, this.value)) {
      labelInput.value = labelLabel.innerText;
    }

    labelInput.style.display = "none";
  });
  labelInput.addEventListener("keyup", function (evt) {
    if (evt.code === "Enter" || evt.code === "NumpadEnter") {
      if (handleEdit(todo.id, this.value)) {
        labelInput.style.display = "none";
      }
    }

    if (evt.code === "Escape") {
      labelInput.value = labelLabel.innerText;
      labelInput.style.display = "none";
    }
  });

  const label = document.createElement("div");
  label.classList.add("todo__item__label");
  label.append(labelLabel, labelInput);

  const deleteBtn = document.createElement("button");
  deleteBtn.title = "Delete";
  deleteBtn.type = "button";
  deleteBtn.innerHTML =
    '<svg fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
  deleteBtn.classList.add("todo__item__delete");
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  const el = document.createElement("li");
  el.classList.add("todo__item");
  el.setAttribute("data-todo", todo.id.toString());

  el.append(check, label, deleteBtn);

  document.querySelector(".todo__list")?.prepend(el);
}

function exist(id: TodoId) {
  return filteredTodos().filter((todo) => todo.id === id).length > 0;
}

function generateId(): number {
  return Math.max(0, ...todos.map((todo) => todo.id)) + 1;
}

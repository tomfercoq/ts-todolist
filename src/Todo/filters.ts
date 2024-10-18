import { Todo } from "./todo";

export enum FilterType {
  all = "all",
  active = "active",
  completed = "completed",
}

export function getType(): FilterType {
  const hash = window.location.hash;
  const route = hash.split("/")[1];

  return route in FilterType
    ? FilterType[route as keyof typeof FilterType]
    : FilterType.all;
}

function renderBadges(badges: Record<FilterType, number>) {
  for (const type in badges) {
    const badge = document.querySelector<HTMLSpanElement>(
      `.todo__filter[data-filter="${type}"] > a > span`
    );

    if (badge) {
      badge.innerText = badges[type as FilterType].toString();
    }
  }
}

function renderActive() {
  const type = getType();

  document.querySelectorAll(".todo__filter").forEach(function (el) {
    if (el.getAttribute("data-filter") === type) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

export function renderFilters(todos: Todo[]) {
  const all = todos.length;
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = all - active;

  renderBadges({ all, active, completed });
  renderActive();
}

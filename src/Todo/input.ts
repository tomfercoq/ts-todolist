import { createTodo } from "./todo";

function getInput(): HTMLInputElement {
  return document.querySelector(".todo__input")!;
}

function clearInput() {
  getInput().value = "";
}

function handleBlur() {
  createTodo({ value: getInput().value });
  clearInput();
}

function handleKeyup(evt: KeyboardEvent) {
  if (evt.code === "Enter" || evt.code === "NumpadEnter") {
    createTodo({ value: getInput().value });
    clearInput();
  }

  if (evt.code === "Escape") {
    clearInput();
  }
}

export function registerEvents() {
  const input = getInput();

  input.addEventListener("blur", handleBlur);
  input.addEventListener("keyup", handleKeyup);
}

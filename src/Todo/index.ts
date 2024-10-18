import { registerEvents } from "./input";
import { renderList } from "./todo";
import Storage from "./storage";

function load() {
  registerEvents();
  renderList(Storage.get());

  window.addEventListener("hashchange", function () {
    renderList();
  });
}

export default {
  load,
};

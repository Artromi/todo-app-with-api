"use strict";
const formEl = document.getElementById("add-todo-form");
const btnAdd = document.getElementById("btn-add");
const textInput = document.getElementById("todo-input");
const btnRemove = document.getElementById("btn-remove");
const optionsAll = document.getElementById("all");
const optionsDone = document.getElementById("done");
const optionsOpen = document.getElementById("open");
const todoList = document.getElementById("todo-list");
const url = "http://localhost:4730/todos";
//
// ++++ LOCAL STATE ++++
const state = localStorage.getItem("state")
  ? JSON.parse(localStorage.getItem("state"))
  : {
      filter: "all",
      todos: [{ description: "learn something", id: "default", done: false }],
    };
// ++++ INITIAL CALL ++++
updateLocalStorage();
refresh();
renderElements();
//
// ++++ FUNCTIONS ++++
// render function
function renderElements() {
  todoList.innerHTML = "";
  // create elements
  for (const todo of state.todos.filter((todo) => {
    if (state.filter === "done") {
      return todo.done === true;
    } else if (state.filter === "open") {
      return todo.done === false;
    }
    return true;
  })) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const itemLabel = document.createElement("label");
    // attributes/value for elements
    checkbox.type = "checkbox";
    checkbox.id = todo.id;
    checkbox.checked = todo.done;
    if (checkbox.checked) {
      itemLabel.classList.toggle("done");
      listItem.classList.toggle("list-item-done");
    }
    checkbox.addEventListener("change", function (e) {
      const doneState = e.target.checked;
      todo.done = doneState;
      updateDoneState(todo);
      refresh();
      renderElements();
    });

    itemLabel.textContent = todo.description;
    itemLabel.setAttribute("for", todo.id);
    // append elements
    listItem.appendChild(checkbox);
    listItem.appendChild(itemLabel);
    todoList.appendChild(listItem);
  }
}
// API fetch
function refresh() {
  fetch(url)
    .then((response) => response.json())
    .then((todos) => {
      state.todos = todos;
      updateLocalStorage();
      renderElements();
    })
    .catch((error) => console.error(error));
}
// add todo function
function addTodo(e) {
  e.preventDefault();
  let todoValue = textInput.value;
  if (!todoValue.trim()) {
    window.alert("add todo pls!");
    return;
  }
  if (
    state.todos.findIndex(
      (todo) =>
        todo.description.toLowerCase().trim() === todoValue.toLowerCase().trim()
    ) === -1
  ) {
    // POST
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ description: todoValue, done: false }),
    })
      .then((response) => {
        response.json();
      })
      .then((newTodoFromApi) => {
        console.log(newTodoFromApi);
        refresh();
      })
      .catch((error) => window.alert(error)); // console.error(error));
  } else {
    window.alert("todo is already in list!");
  }
  textInput.value = "";
  refresh();
  renderElements();
}
//
// PUT request
function updateDoneState(todo) {
  fetch(`${url}/${todo.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(todo),
  })
    .then((response) => {
      console.log(response);
      refresh();
    })
    .catch((error) => window.alert(error)); //console.error(error));
}
//
// remove function
function removeTodos(e) {
  e.preventDefault();
  state.todos.forEach((todo) => {
    if (todo.done) {
      fetch(`${url}/${todo.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          console.log(response);
          refresh();
        })
        .catch((error) => window.alert(error)); // console.error(error));
    }
  });

  refresh();
  renderElements();
}
// function to update local storage with the current state
function updateLocalStorage() {
  localStorage.setItem("state", JSON.stringify(state));
}
// update & render function
function updateAndRender() {
  updateLocalStorage();
  refresh();
  renderElements();
}
//
// ++++ EVENT LISTENER ++++
btnAdd.addEventListener("click", addTodo);
btnRemove.addEventListener("click", removeTodos);
optionsDone.addEventListener("change", () => {
  state.filter = "done";
  updateAndRender();
});
optionsOpen.addEventListener("change", () => {
  state.filter = "open";
  updateAndRender();
});
optionsAll.addEventListener("change", () => {
  state.filter = "all";
  updateAndRender();
});
//
//
// createID function
// function createId() {
//   let date = Date().split(" ").slice(1, 5).join("-");
//   return date;
// }

"use strict";

const btnAdd = document.getElementById("btn-add");
const textInput = document.getElementById("todo-input");
const btnRemove = document.getElementById("btn-remove");
const optionsAll = document.getElementById("all");
const optionsDone = document.getElementById("done");
const optionsOpen = document.getElementById("open");
const todoList = document.getElementById("todo-list");
const url = "http://localhost:4730/todos";
//
// state
const state = localStorage.getItem("state")
  ? JSON.parse(localStorage.getItem("state"))
  : {
      filter: "all",
      todos: [{ description: "learn something", id: "default", done: false }],
    };
//
// call render function
fetchFromApi();
renderElements();
//
// FUNCTIONS //
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
      itemLabel.classList.toggle("linethrough");
    }
    checkbox.addEventListener("change", function (e) {
      const doneState = e.target.checked;
      todo.done = doneState;
      updateAndRender();
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
function fetchFromApi() {
  fetch(url)
    .then((response) => response.json())
    .then((todos) => {
      console.log(todos);
      state.todos = todos;
      renderElements();
    });
}
// add todo function
function addTodo(e) {
  e.preventDefault();
  let todoValue = textInput.value;
  if (!todoValue.trim()) {
    window.alert("add todo pls!");
    return;
  }
  // fetch POST
  const newTodo = { description: todoValue, done: false };
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((newTodoFromApi) => {
      console.log(newTodoFromApi);
    });
  //

  /*const todoObj = {
    description: todoValue,
    done: false,
    id: createId(),
  };
  */
  if (
    state.todos.findIndex(
      (todo) =>
        todo.description.toLowerCase().trim() === todoValue.toLowerCase().trim()
    ) === -1
  ) {
    state.todos.push(newTodo);
  } else {
    window.alert("todo is already in list!");
  }
  textInput.value = "";
  updateAndRender();
}
// createID function
function createId() {
  let date = Date().split(" ").slice(1, 5).join("-");
  return date;
}

// remove function
function removeTodos(e) {
  e.preventDefault();
  const newArr = [];
  state.todos.forEach((todo) => {
    if (!todo.done) {
      newArr.push(todo);
    }
  });
  state.todos = newArr;
  updateAndRender();
}
// Function to update local storage with the current state
function updateLocalStorage() {
  localStorage.setItem("state", JSON.stringify(state));
}
// update & render function
function updateAndRender() {
  updateLocalStorage();
  renderElements();
}
// EVENT LISTENER //
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

// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");

// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];

for (let todo of todos) {
  addItem(todo);
}

// 函式
function addItem(text) {
  let newItem = document.createElement("li");
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `;
  list.appendChild(newItem);
}

// Create
addBtn.addEventListener("click", function (event) {


  const target = event.target
  const inputSectionTodoList = target.parentElement
  const inputField = inputSectionTodoList.children[0]


  const inputValue = input.value;

  if (inputValue.trim() === "") {

    inputSectionTodoList.style.setProperty('--error-sign-display', ' ')
    inputField.style.setProperty('--error-sign-border', '1px solid #FF665A')

  } else if (inputValue.length > 0) {
    addItem(inputValue)

    inputSectionTodoList.style.setProperty('--error-sign-display', 'none')
    inputField.style.setProperty('--error-sign-border', '1px solid #ced4da')
  }
});

// Delete and check
list.addEventListener("click", function (event) {
  const target = event.target;

  if (target.classList.contains("delete")) {
    let parentElement = target.parentElement;
    parentElement.remove();
  } else if (target.tagName === "LABEL") {
    target.classList.toggle("checked");
  }
});


// 初始變數
let list = document.querySelector('#my-todo')
let addBtn = document.querySelector('#addBtn')
let input = document.querySelector('#newTodo')

// 資料
const todos = ['Hit the gym', 'Read a book', 'Buy eggs', 'Organize office', 'Pay bills']
for (let todo of todos) {
  addItem(todo)
}


// 函式
function addItem (text) {
  let newItem = document.createElement('li')
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `
  list.appendChild(newItem)
}


// write your code here

addBtn.addEventListener('click', addContent)


function addContent () {
  let inputValue = input.value
  
  if (inputValue.length > 0) {
      addItem(inputValue)
  }
  
}
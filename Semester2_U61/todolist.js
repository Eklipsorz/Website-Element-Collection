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




/* 增加項目至項目清單中 */


/* 額外添加function 是為了以後方便釋放而與addEventListener分開 */
addBtn.addEventListener('click', function addContent() {
    let inputValue = input.value
  
    /* 判斷input內部的值是否為空字串，若不是才加入至list */
    if (inputValue.length > 0) {
        addItem(inputValue)
    }
})


/* 從項目清單中移除指定項目 */


/* 由list元素去監聽子元素的事件 */
list.addEventListener('click', function(event) {

    let target = event.target

    /* 處理 delete btn元素 */
    if (target.classList.contains('delete'))
    {
        let listItem = target.parentElement
        listItem.remove()
    }
    
    /* 處理task name的元素 */
    if (target.tagName === 'LABEL') {
        target.classList.toggle('checked')
    }
})


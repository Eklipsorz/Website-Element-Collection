// 初始變數
const list = document.querySelector("#my-todo")
const addBtn = document.querySelector("#add-btn")
const input = document.querySelector("#new-todo")

// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
]

for (let todo of todos) {
  addItem(todo);
}

// 函式
function addItem(text) {
  let newItem = document.createElement("li")
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `
  list.appendChild(newItem)
}


function showWarningMessage(elementNode, isError) {



  /* 增加項目之區塊(含輸入欄、輸入欄的錯誤標記、輸入按鈕) */
  const inputSectionTodoList = elementNode
  /* 增加項目之區塊下: 輸入欄的錯誤訊息 */
  const errorMessage = elementNode.children[2]
  /* 增加項目之區塊下: 輸入欄 */
  const inputField = elementNode.children[0]


  const cssDisplay = isError ? ' ' : 'none'
  const cssBorderColor = isError ? '#FF665A' : '#ced4da'



  /* 設定錯誤訊息、錯誤符號、線條的樣式 */
  errorMessage.style.setProperty('--list__add-item-section-error-message-display', cssDisplay)
  inputSectionTodoList.style.setProperty('--list__add-item-section--error-display', cssDisplay)
  inputField.style.setProperty('--list__input-field-border-color', cssBorderColor)


}


// Create
addBtn.addEventListener("click", function (event) {


  const target = event.target
  const inputField = target.previousElementSibling
  const inputValue = input.value

  if (inputValue.trim() === "") {
    /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */

    /* 顯示錯誤訊息、調整相關樣式 */
    showWarningMessage(target.parentElement, true)
  } else {

    /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
    showWarningMessage(target.parentElement, false)

    /* 當輸入不完全是空白時，便允許增加項目 */
    addItem(inputValue)

    console.log('hi')
    inputField.value = ""
    inputField.placeholder = "add item"
  }

})

// Delete and check
list.addEventListener("click", function (event) {

  const target = event.target

  if (target.classList.contains("delete")) {
    let parentElement = target.parentElement;
    parentElement.remove()
  } else if (target.tagName === "LABEL") {
    target.classList.toggle("checked")
  }
});


input.addEventListener("keypress", function (event) {

  const target = event.target
  const inputValue = input.value

  if (event.key === "Enter") {

    console.log('hi')
    if (inputValue.trim() === "") {
      /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */

      /* 顯示錯誤訊息、調整相關樣式 */
      showWarningMessage(target.parentElement, true)
    } else {

      /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
      showWarningMessage(target.parentElement, false)

      /* 當輸入不完全是空白時，便允許增加項目 */
      addItem(inputValue)

      target.value = ""
      placeholder = "add item"

    }



  }

})
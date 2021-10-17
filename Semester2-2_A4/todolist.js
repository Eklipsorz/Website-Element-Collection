// 初始變數
const list = document.querySelector("#my-todo")
const addBtn = document.querySelector("#add-btn")
const input = document.querySelector("#new-todo")
const doneList = document.querySelector('#my-done')
// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
]



// 負責處理增加項目至清單的函式

const model = {
  addItem(text) {

    let newItem = document.createElement("li")
    newItem.classList.add('list-item')
    newItem.innerHTML = `
      <label for="todo">${text}</label>
      <i class="delete fa fa-trash"></i>
    `
    list.appendChild(newItem)
  }

}




for (let todo of todos) {
  model.addItem(todo);
}


function showWarningMessage(elementNode, isError) {



  /* 增加項目之區塊(含輸入欄、輸入欄的錯誤標記、輸入按鈕) */
  const inputSectionTodoList = elementNode

  /* 增加項目之區塊下: 輸入欄 */
  const inputField = elementNode.children[0]

  /* 增加項目之區塊下: 輸入欄的錯誤訊息 */
  const errorMessage = document.querySelector('.input-error-message')

  const cssDisplay = isError ? ' ' : 'none'
  const cssBorderColor = isError ? '#FF665A' : '#ced4da'

  console.log(cssDisplay, cssBorderColor)

  /* 設定錯誤訊息、錯誤符號、線條的樣式 */
  errorMessage.style.setProperty('--input-error-message-display', cssDisplay)
  inputSectionTodoList.style.setProperty('--input-error-sign-display', cssDisplay)
  inputField.style.setProperty('--input-field-border-color', cssBorderColor)


}

/* TODO: 程式碼優化 */
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
    model.addItem(inputValue)

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
    // doneList.appendChild()
    let parentElement = target.parentElement;
    target.classList.toggle("checked")
    parentElement.remove()
    doneList.appendChild(parentElement)

  }
});

// Delete and check
doneList.addEventListener("click", function (event) {

  const target = event.target

  if (target.classList.contains("delete")) {
    let parentElement = target.parentElement;
    parentElement.remove()
  } else if (target.tagName === "LABEL") {
    // doneList.appendChild()
    let parentElement = target.parentElement;

    target.classList.toggle("checked")
    parentElement.remove()
    list.appendChild(parentElement)

  }
});




/* TODO: 程式碼優化 */
input.addEventListener("keypress", function (event) {

  const target = event.target
  const inputValue = input.value

  if (event.key === "Enter") {


    if (inputValue.trim() === "") {
      /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */

      /* 顯示錯誤訊息、調整相關樣式 */
      showWarningMessage(target.parentElement, true)
    } else {

      /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
      showWarningMessage(target.parentElement, false)

      /* 當輸入不完全是空白時，便允許增加項目 */
      model.addItem(inputValue)

      target.value = ""
      placeholder = "add item"

    }



  }

})
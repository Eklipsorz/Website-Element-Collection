// 初始變數
const addBtn = document.querySelector("#add-btn")
const input = document.querySelector("#new-todo")
const todoList = document.querySelector("#my-todo")
const doneList = document.querySelector('#my-done')
const lists = document.querySelectorAll('.list')

// 資料
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
]



// 負責處理 Data 和 Business Logic，但在這裡由於篇幅有限就設定為空
const model = {

}

// 負責處理畫面渲染
const view = {
  // 以初始值來渲染輸入欄
  renderInputField(inputField) {
    inputField.value = ""
    inputField.placeholder = "add item"
  },
  // 進行增加項目時的渲染
  renderNewItemOnList(list, text) {


    let newItem = document.createElement("li")
    newItem.classList.add('list-item')
    newItem.innerHTML = `
      <label for="todo">${text}</label>
      <i class="delete fa fa-trash"></i>
    `
    newItem.setAttribute('draggable', "true")
    this.addEventListenerToNewItem(newItem)

    list.appendChild(newItem)
  },
  // 替新增的清單項目增加拖曳事件
  addEventListenerToNewItem(newItem) {

    // 當發生拖曳時就替當前元件設定正在拖曳的狀態
    newItem.addEventListener('dragstart', () => {
      newItem.classList.add('dragging')
    })
    // 當發生拖曳並釋放游標時就替當前元件解除正在拖曳的狀態
    newItem.addEventListener('dragend', () => {
      newItem.classList.remove('dragging')
    })

  },
  // 進行拖曳項目時的渲染
  renderDraggedItem(list, clientY) {



    // 取得正在發生拖曳的元件
    const draggingElement = document.querySelector('.dragging')

    // 根據拖曳游標的座標位置來取得該游標最近的項目元件
    const dragAfterElement = this.getDragAfterElement(list, clientY)

    // 若為null，表示該元件就在清單的最後一個位置
    if (dragAfterElement === null) {
      // 直接在清單後面添加正在發生拖曳的元件
      list.appendChild(draggingElement)
    } else {
      // 在最近的項目元件之前添加正在發生拖曳的元件
      list.insertBefore(draggingElement, dragAfterElement)
    }

  },
  // 從發生拖曳事件的清單裡，取得離拖曳游標最近的項目元件
  // list 是發生拖曳事件的清單，clientY則是相對於viewport的Y軸座標
  getDragAfterElement(list, clientY) {


    // 排除掉正在發生拖曳的元件而由同一個清單下的剩餘項目組成一個陣列
    const draggableElements = [...list.querySelectorAll('.list-item:not(.dragging)')]


    // 對剩下項目來與正在發生拖曳的元件誰比較近，會以clientY代表正在發生拖曳的元件
    // 最後會以closestObj所擁有element元件代表結果，若為null則表示正發生拖曳的元件在清單最後面
    // 否則就回傳較近的項目元件
    return draggableElements.reduce((closestObj, childElement) => {

      // 取得DOMRect元件(該元件會包含著childElement)，由它來代表childElement。
      const elementBox = childElement.getBoundingClientRect()
      // clientY 是滑鼠游標所在位置(0~N，越上面越小，越下面越大)
      // box.top 是childElement元件上邊界至螢幕邊界的距離
      // box.height是指childElement元件內容高度 + padding-top + border + margin-top

      // 在這裏以elementBox.top和elementBox.height / 2為界線來判定正在發生拖曳的元件是離誰比較近
      const offset = clientY - elementBox.top - elementBox.height / 2

      // 通常離得近的元件會得到負值offset，且越接近為0就代表越近。
      // 所以會在這情況下取得能讓offset保持負值且是當中最大的childElement
      if (offset < 0 && offset > closestObj.offset) {
        return { offset: offset, element: childElement }
      } else {
        return closestObj
      }

    }, { offset: Number.NEGATIVE_INFINITY }).element
    // offset: Number.NEGATIVE_INFINITY 是設定一個非常小的初始值來比較。

  },
  // 當移除項目時就針對該項目進行渲染
  renderRemovedItemOnList(targetElement) {
    targetElement.remove()
  },
  // 當轉移項目至其他清單時就針對該項目進行渲染
  renderMovedItemOnAnotherList(targetElement, anotherList) {
    let parentElement = targetElement.parentElement;
    targetElement.classList.toggle("checked")
    parentElement.remove()
    anotherList.appendChild(parentElement)

  },
  // 當對目前輸入欄為空進行項目增加時，會跑出適當的錯誤訊息
  showWarningMessage(isError) {

    /* 增加項目之區塊(含輸入欄、輸入欄的錯誤標記、輸入按鈕) */
    const inputSection = document.querySelector('.add-item-section')

    /* 增加項目之區塊下: 輸入欄 */
    const inputField = inputSection.children[0]

    /* 增加項目之區塊下: 輸入欄的錯誤符號 */
    const errorSign = inputSection.children[1]

    /* 增加項目之區塊下: 輸入欄的錯誤訊息 */
    const errorMessage = inputSection.children[2]


    /* 根據isError 來判斷 */
    const cssDisplay = isError ? ' ' : 'none'
    const cssBorderColor = isError ? '#FF665A' : '#ced4da'


    /* 設定錯誤訊息、錯誤符號、線條的樣式 */
    inputField.style.setProperty('--input-field-border-color', cssBorderColor)
    errorSign.style.setProperty('--input-error-sign-display', cssDisplay)
    errorMessage.style.setProperty('--input-error-message-display', cssDisplay)


  }

}

// 負責接收使用者請求和回應(介面互動的綁定)
const controller = {

  // 分配事件處理內容至增加按鈕
  dispatchAddBtnClickedAction(targetElement) {

    const target = targetElement
    const inputField = target.previousElementSibling
    const inputValue = input.value

    if (inputValue.trim() === "") {
      /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */
      /* 顯示錯誤訊息、調整相關樣式 */
      view.showWarningMessage(true)
    } else {

      /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
      view.showWarningMessage(false)

      /* 當輸入不完全是空白時，便允許增加項目 */
      view.renderNewItemOnList(todoList, inputValue)
      view.renderInputField(input)

    }
  },
  // 分配事件處理內容至輸入欄輸入事件
  dispatchInputFieldInputedAction(event) {
    const target = event.target
    const inputValue = input.value

    // 當鍵盤按下Enter就代表要增加元素
    if (event.key === "Enter") {

      /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */
      if (inputValue.trim() === "") {


        /* 顯示錯誤訊息、調整相關樣式 */
        view.showWarningMessage(true)
      } else {

        /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
        view.showWarningMessage(false)


        /* 當輸入不完全是空白時，便允許增加項目 */
        view.renderNewItemOnList(todoList, inputValue)

        view.renderInputField(input)

      }



    }
  },
  // 分配事件處理內容至每個清單的點擊事件
  dispatchListClickedAction(targetElement, currentListType) {

    const target = targetElement
    if (target.classList.contains("delete")) {
      // 當按下垃圾桶就刪除
      view.renderRemovedItemOnList(target.parentElement)
    } else if (target.tagName === "LABEL") {
      // 當按下項目區塊時，就轉移另一個清單
      const anotherList = currentListType === 'todo' ? doneList : todoList
      view.renderMovedItemOnAnotherList(target, anotherList)
    }

  },
  dispatchListDraggedAction(list, clientY) {

    view.renderDraggedItem(list, clientY)

  }


}



// 增加按鈕上的點擊事件處理
addBtn.addEventListener("click", function (event) {
  controller.dispatchAddBtnClickedAction(event.target)
})

// todoList 上 的 點擊事件處理
todoList.addEventListener("click", function (event) {
  controller.dispatchListClickedAction(event.target, 'todo')
});

// doneList 上 的 點擊事件處理
doneList.addEventListener("click", function (event) {
  controller.dispatchListClickedAction(event.target, 'done')
});




// todoList 上的輸入欄輸入事件處理 
input.addEventListener("keypress", function (event) {
  controller.dispatchInputFieldInputedAction(event)
})

// 每個清單(todo 清單 和 done 清單)的拖曳事件處理
lists.forEach(list => {

  list.addEventListener('dragover', event => {
    event.preventDefault()
    controller.dispatchListDraggedAction(list, event.clientY)
  })

})


// 渲染清單一開始擁有的項目
for (let todo of todos) {
  view.renderNewItemOnList(todoList, todo);
}




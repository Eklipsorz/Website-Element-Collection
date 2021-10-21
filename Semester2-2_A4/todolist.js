/* 初始資料區域 */

/* 初始變數 */
const addBtn = document.querySelector("#add-btn")
const input = document.querySelector("#new-todo")
const todoList = document.querySelector("#my-todo")
const doneList = document.querySelector('#my-done')
/* 取得所有清單(包含todo、done這兩種) */
const lists = document.querySelectorAll('.list')

/* 資料 */
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
]

/* MVC架構區域 */

/* 負責處理 Data 和 Business Logic，但在這裡由於篇幅有限就設定為空 */
const model = {
  todoList: [],
  doneList: [],
  /* 新增清單項目的setter */
  listSetter({ listType, itemTitle, itemReference }) {

    const list = listType === 'todo' ? this.todoList : this.doneList
    list.push({ itemTitle, itemReference })

  },
  /* 取得清單項目的getter */
  listGetter({ listType, listItemStartIndex, listItemNumber }) {
    const list = listType === 'todo' ? this.todoList : this.doneList
    return list.slice(listItemStartIndex, listItemStartIndex + listItemNumber)
  },
  /* 刪除清單項目 */
  listItemDelete(listType, itemTitle) {
    const list = listType === 'todo' ? this.todoList : this.doneList
    const itemIndex = this.listSearcher(listType, itemTitle)
    list.splice(itemIndex, 1)
  },
  /* 根據項目標題和清單類型來尋找並回傳對應index */
  listSearcher(listType, itemTitle) {
    const list = listType === 'todo' ? this.todoList : this.doneList
    return list.findIndex(listItem => listItem.itemTitle === itemTitle)
  },
  /* 轉移項目至其他清單 */
  listItemMigration({ listType, toListType, itemTitle }) {

    const fromList = listType === 'todo' ? this.todoList : this.doneList
    const targetItem = fromList[this.listSearcher(listType, itemTitle)]

    /* 在另一個清單增加相同項目 */
    this.listSetter({
      listType: toListType,
      itemTitle: targetItem.itemTitle,
      itemReference: targetItem.itemReference
    })

    /* 刪掉原本清單的相同項目 */
    this.listItemDelete(listType, itemTitle)

  }


}

/* 負責處理畫面渲染 */
const view = {
  /* 以初始值來渲染輸入欄 */
  renderInputField(inputField) {
    inputField.value = ""
    inputField.placeholder = "add item"
  },
  /* 進行增加項目時的渲染，會回傳渲染後的項目 */
  renderNewItemOnList(list, text) {

    /* 建立一個新項目元件 */
    let newItem = document.createElement("li")

    /* 設定每個新項目的樣式 */
    newItem.classList.add('list-item')

    /* 設定每個新項目的內容 */
    newItem.innerHTML = `
      <label for="todo">${text}</label>
      <i class="delete fa fa-trash"></i>
    `
    /* 設定每個新項目為可拖曳的 */
    newItem.setAttribute('draggable', "true")

    /* 設定每個新項目是隸屬於哪個清單 */
    newItem.setAttribute('data-listbelong', "todo")

    /* 替每個新項目增加事件綁定 */
    this.addEventListenerToNewItem(newItem)

    /* 將項目增加至清單中 */
    list.appendChild(newItem)

    return newItem
  },
  /* 替新增的清單項目增加拖曳事件 */
  addEventListenerToNewItem(newItem) {

    /* 當發生拖曳時就替當前元件設定正在拖曳的狀態 */
    newItem.addEventListener('dragstart', () => {
      newItem.classList.add('dragging')
    })
    /* 當發生拖曳並釋放游標時就替當前元件解除正在拖曳的狀態 */
    newItem.addEventListener('dragend', () => {
      newItem.classList.remove('dragging')
    })

  },
  /* 針對發生拖曳的清單list而做的渲染，過程中會需要Y軸來判定 */
  renderDraggedItem(list, clientY) {

    /* 取得正在發生拖曳的元件 */
    const draggingElement = document.querySelector('.dragging')

    /* 根據拖曳游標的座標位置來取得該游標最近的項目元件 */
    const dragAfterElement = this.getDragAfterElement(list, clientY)

    /* 取得目前游標指向的清單是什麼 */
    const targetListType = list.dataset.listtype

    /* 取得正在拖曳元件原隸屬於什麼清單 */
    const draggingElementBelongTo = draggingElement.dataset.listbelong


    /* 當拖曳游標釋放後所在清單並不是原本拖曳所在的清單時，就切換該項目的樣式和資料轉移 */
    if (targetListType != draggingElementBelongTo) {
      const draggingElementLabel = draggingElement.children[0]
      draggingElement.dataset.listbelong = targetListType

      /* 資料轉移 */
      model.listItemMigration({
        listType: draggingElementBelongTo,
        toListType: targetListType,
        itemTitle: draggingElementLabel.innerText
      })

      /* 切換樣式 */
      draggingElementLabel.classList.toggle("checked")
    }


    /* 若為null，表示該元件就在清單的最後一個位置 */
    if (dragAfterElement === null) {
      /* 直接在清單後面添加正在發生拖曳的元件 */
      list.appendChild(draggingElement)
    } else {
      /* 在最近的項目元件之前添加正在發生拖曳的元件 */
      list.insertBefore(draggingElement, dragAfterElement)

    }


  },
  /* 
     從發生拖曳事件的清單裡，取得離拖曳游標最近的項目元件
     list 是發生拖曳事件的清單，clientY則是相對於viewport的Y軸座標
  */
  getDragAfterElement(list, clientY) {

    /* 排除掉正在發生拖曳的元件而由同一個清單下的剩餘項目組成一個陣列 */
    const draggableElements = [...list.querySelectorAll('.list-item:not(.dragging)')]

    /*
       對剩下項目來與正在發生拖曳的元件誰比較近，會以clientY代表正在發生拖曳的元件
       最後會以closestObj所擁有element元件代表結果，若為null則表示正發生拖曳的元件在清單最後面
       否則就回傳較近的項目元件
    */
    return draggableElements.reduce((closestObj, childElement) => {

      /* 取得DOMRect元件(該元件會包含著childElement)，由它來代表childElement。 */
      const elementBox = childElement.getBoundingClientRect()
      /*
         clientY 是滑鼠游標所在位置(0~N，越上面越小，越下面越大)
         box.top 是childElement元件上邊界至螢幕邊界的距離
         box.height是指childElement元件內容高度 + padding-top + border + margin-top
      */
      /* 在這裏以elementBox.top和elementBox.height / 2為界線來判定正在發生拖曳的元件是離誰比較近 */
      const offset = clientY - elementBox.top - elementBox.height / 2

      /*
         通常離得近的元件會得到負值offset，且越接近為0就代表越近。
         所以會在這情況下取得能讓offset保持負值且是當中最大的childElement
      */
      if (offset < 0 && offset > closestObj.offset) {
        return { offset: offset, element: childElement }
      } else {
        return closestObj
      }

    }, { offset: Number.NEGATIVE_INFINITY }).element
    /* offset: Number.NEGATIVE_INFINITY 是設定一個非常小的初始值來比較。 */

  },
  /* 當移除項目時就針對該項目進行渲染 */
  renderRemovedItemOnList(targetElement) {
    targetElement.remove()
  },
  /* 當轉移項目至其他清單時就針對該項目進行渲染 */
  renderMigratedItem(targetElement, nextListType) {

    const anotherList = nextListType === 'todo' ? todoList : doneList

    let parentElement = targetElement.parentElement;
    targetElement.classList.toggle("checked")

    parentElement.remove()
    /* 設定每個新項目是隸屬於哪個清單 */
    parentElement.setAttribute('data-listbelong', nextListType)
    anotherList.appendChild(parentElement)

  },
  /* 當對目前輸入欄為空進行項目增加時，會跑出適當的錯誤訊息 */
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

/* 負責接收使用者請求和回應(介面互動的綁定) */
const controller = {

  /* 設定初始清單畫面 */
  resetListDisplay() {

    /* 以初始給定的項目進行渲染和增加 */
    for (let todoItem of todos) {
      const itemReference = view.renderNewItemOnList(todoList, todoItem)
      model.listSetter({
        listType: 'todo',
        itemTitle: todoItem,
        itemReference: itemReference
      })

    }
  },
  /* 根據輸入欄是否為空來決定渲染情形、資料增加，主要會檢測和增加 */
  dispatchAddItemAction(inputField) {

    const inputValue = inputField.value

    if (inputValue.trim() === "") {
      /* 當輸入全是空白時，便代表著錯誤，會跑出錯誤訊息及調整相關樣式(線條、出現錯誤符號) */
      /* 顯示錯誤訊息、調整相關樣式 */
      view.showWarningMessage(true)
    } else {

      this.addItemAction(inputField)

    }

  },
  /* 實際負責增加項目以及增加相關樣式的函式 */
  addItemAction(inputField) {

    const inputValue = inputField.value
    /* 重設線條、錯誤符號的樣式，避免一開始使用者輸入錯誤而造成樣式維持錯誤時的樣式 */
    view.showWarningMessage(false)

    /* 當輸入不完全是空白時，便允許增加項目 */
    const itemReference = view.renderNewItemOnList(todoList, inputValue)

    /* 當增加完便重新渲染一次輸入欄樣式 */
    view.renderInputField(inputField)

    /* 增加實際項目至 Model */
    model.listSetter({
      listType: 'todo',
      itemTitle: inputValue,
      itemReference: itemReference
    })

  },
  /* 分配事件處理內容至增加按鈕 */
  dispatchAddBtnClickedAction(inputField) {

    /* 根據輸入欄是否為空來決定渲染情形、資料增加 */
    this.dispatchAddItemAction(inputField)
  },
  /* 分配事件處理內容至輸入欄輸入事件 */
  dispatchInputFieldInputedAction(event) {

    /* 當鍵盤按下Enter就代表要增加元素 */
    if (event.key === "Enter") {
      /* 根據輸入欄是否為空來決定渲染情形、資料增加 */
      this.dispatchAddItemAction(event.target)

    }
  },
  /* 分配事件處理內容至每個清單項目的點擊事件 */
  dispatchListClickedAction(targetElement, currentListType) {

    const target = targetElement
    if (target.classList.contains("delete")) {

      /* 當按下垃圾桶就刪除 */
      model.listItemDelete(currentListType, target.previousElementSibling.innerText)
      view.renderRemovedItemOnList(target.parentElement)


    } else if (target.tagName === "LABEL") {
      /* 當按下項目區塊時，就轉移另一個清單 */
      const nextListType = currentListType === 'todo' ? 'done' : 'todo'

      /* 轉移項目至另一個清單 */
      model.listItemMigration({
        listType: currentListType,
        toListType: nextListType,
        itemTitle: target.innerText
      })

      view.renderMigratedItem(target, nextListType)
    }

  },
  /* 分配事件處理內容至每個清單項目的拖曳事件 */
  dispatchListDraggedAction(list, clientY) {

    view.renderDraggedItem(list, clientY)

  }


}


/* 元件事件綁定區域 */


/* 增加按鈕上的點擊事件處理 */
addBtn.addEventListener("click", function (event) {
  controller.dispatchAddBtnClickedAction(input)
})

/* todoList 上 的 點擊事件處理 */
todoList.addEventListener("click", function (event) {
  controller.dispatchListClickedAction(event.target, 'todo')
});

/* doneList 上 的 點擊事件處理 */
doneList.addEventListener("click", function (event) {
  controller.dispatchListClickedAction(event.target, 'done')
});




/* todoList 上的輸入欄輸入事件處理 */
input.addEventListener("keypress", function (event) {
  controller.dispatchInputFieldInputedAction(event)
})

/* 每個清單(todo 清單 和 done 清單)的拖曳事件處理 */
lists.forEach(list => {

  list.addEventListener('dragover', event => {
    event.preventDefault()
    controller.dispatchListDraggedAction(list, event.clientY)
  })

})


/* 渲染清單一開始擁有的項目 */
controller.resetListDisplay()


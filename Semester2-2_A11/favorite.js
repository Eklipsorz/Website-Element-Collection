// 定義清單類型
// NormalFriendList 定義一般清單類型，該清單內容是從API Server下載回來的原檔內容
// FilteredFriendList 定義內容被篩選後的清單類型，該清單內容是利用搜尋而獲取的搜尋結果
// FavoriteFriendList 定義最愛朋友清單類型，該清單內容是所有被標記為最愛(實心星號)的朋友
const LIST_TYPE = {
  NormalFriendList: "NormalFriendList",
  FilteredFriendList: "FilteredFriendList",
  FavoriteFriendList: "FavoriteFriendList"
}

// 存放朋友資料的面板
const dataPanel = document.querySelector('#data-panel')

// 搜尋輸入元件
const searchControl = document.querySelector('#search-bar-control')

// 分頁器
const paginator = document.querySelector('#paginator')


// 定義 API Server 
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/users/'

// 定義每一頁能存放幾個朋友
const FRIENDS_PER_PAGE = 8

// 定義每一個頁群組能放幾頁，每N頁為一組
const PAGES_PER_PAGE_GROUP = 5

// 定義整個商業邏輯、資料管理
const model = {
  // friend and isFavorite
  // model 內部會存放三種清單，不是最上面的清單類型
  // friendList 是存放從API下載回來的朋友資料(每個朋友都額外增加isFavorite這屬性來判別誰在最愛朋友清單中)
  // favoriteList 是存放最愛朋友清單的朋友資料(每個朋友會用實心星號來表示)
  // filteredFriendList 是存放搜尋欄輸入後的搜尋結果
  friendList: [],
  favoriteList: [],
  filteredFriendList: [],
  // 根據清單類型 listType 來獲取對應清單
  listGetter(listType) {
    let list = null

    switch (listType) {
      case LIST_TYPE.NormalFriendList:
        list = this.friendList
        break
      case LIST_TYPE.FilteredFriendList:
        list = this.filteredFriendList
        break
      case LIST_TYPE.FavoriteFriendList:
        list = this.favoriteList
        break
    }

    return list
  },
  // 根據清單類型 listType 來將資料增加至對應清單
  listAdder(listType, data) {

    let list = this.listGetter(listType)

    list.push(...data)

  },
  // 根據清單類型 listType 來設定對應清單指向為新的清單 newList 
  listSetter(listType, newList) {

    switch (listType) {
      case LIST_TYPE.NormalFriendList:
        this.friendList = newList
        break
      case LIST_TYPE.FilteredFriendList:
        this.filteredFriendList = newList
        break
      case LIST_TYPE.FavoriteFriendList:
        this.favoriteList = newList
        break
    }

  },
  // 根據清單類型 listType 來獲取對應清單的大小
  listLengthGetter(listType) {
    const list = this.listGetter(listType)
    return list.length
  },
  // 根據清單類型 listType 以及 對應頁面 page 來獲取對應清單中在第page頁的朋友資料
  getFriendsByPage(listType, page) {

    const data = this.listGetter(listType)

    const startFriendIndex = (page - 1) * FRIENDS_PER_PAGE

    return data.slice(startFriendIndex, startFriendIndex + FRIENDS_PER_PAGE)
  },
  // 將朋友資料數轉換頁數
  parsePage(amount) {
    return Math.ceil(amount / FRIENDS_PER_PAGE)
  },
  // 將總頁數分成好幾個群組(Page Group)，每一個群組都有各自頁數來實現分頁器一次
  // 只渲染指定頁數，比如第一組為1-5頁，第二組為6-10頁，後面以此類推，其中1是第一組
  // 的起始頁數，而5就是第一組的結尾頁數，該函式會根據目前清單類型和目前所在頁數來換
  // 算目前頁數所在的群組在哪，然後再回傳 pageIndex 物件，該物件會代表該群組的起始
  // 頁數、結尾頁數、該群組是否為最後一個群組。
  //
  // 該物件會存三種值，isLastPageGroup、start、end
  // isLastPageGroup 為布林值，當是true的時候，就代表目前群組為最後群組
  // start 為數字，代表著目前所在群組的起始頁數
  // end 為數字，代表著目前所在群組的結尾頁數
  getPageIndexByPageGroup(listType, currentPage) {

    // 獲取總頁數
    let allPages = model.parsePage(model.listLengthGetter(listType))

    // 將目前所在頁數轉換至對應群組
    const currentPageGroup = Math.ceil(currentPage / PAGES_PER_PAGE_GROUP)

    // 將總頁數轉換成最後群組
    const lastPageGroup = Math.ceil(allPages / PAGES_PER_PAGE_GROUP)

    // 定義 pageIndex 物件
    let pageIndex = {
      isLastPageGroup: false,
      start: 1,
      end: 1
    }

    // 評估目前所在群組是否為最後群組
    pageIndex.isLastPageGroup = currentPageGroup === lastPageGroup

    // 獲取目前所在群組的起始頁數和結尾頁數
    pageIndex.start = (currentPageGroup - 1) * PAGES_PER_PAGE_GROUP + 1
    pageIndex.end = pageIndex.isLastPageGroup ?
      allPages :
      pageIndex.start + PAGES_PER_PAGE_GROUP - 1


    return pageIndex

  },
  // 在model層面上，從指定清單中刪除指定朋友(用id表示)
  // 在這裡會考量到搜尋時刪除和不用搜尋來刪除這兩個情況，因此會根據lisType來從最愛朋友清單或儲存搜尋結果清單中刪除朋友
  // 當listType為FilteredFriendList，就代表著目前是搜尋中，若要在這情況下刪除，會從最愛朋友清單和儲存搜尋結果清單來刪除
  // 當listType為FavoriteFriendList，就代表正常清單，若要在這情況下刪除，只會從最愛朋友清單刪除
  removeFriend(listType, id) {

    // 根據listType獲取清單
    const list = this.listGetter(listType)

    // 獲取最愛朋友清單
    const favoriteList = this.favoriteList

    let favoriteFriendIndex = 0
    let listFriendIndex = 0

    // 從最愛朋友清單找尋指定朋友(用id表示)並刪除
    favoriteFriendIndex = favoriteList.findIndex(item => item.id === id)
    favoriteList.splice(favoriteFriendIndex, 1)

    // 若目前是搜尋中，就會跟著從儲存搜尋結果清單來刪除
    if (listType != LIST_TYPE.FavoriteFriendList) {
      listFriendIndex = list.findIndex(item => item.id === id)
      list.splice(listFriendIndex, 1)
    }

    // 將model層面的最愛朋友清單更新至localStorage
    localStorage.setItem('favoriteFriends', JSON.stringify(favoriteList))
  }
}



// 定義視覺呈現
const view = {
  // 根據目前對應頁數的朋友資料和pageIndex來建立一個一開始的朋友清單畫面和分頁器畫面
  initializeView(currentPageData, pageIndex) {

    this.renderPaginator(pageIndex)
    this.renderFriendList(currentPageData)
  },
  // 渲染分頁器本身會有的元件以及該元件的事件綁定
  initPaginator() {
    paginator.innerHTML = ''

    // 建立兩個元件來移動頁數，第一個元件是左箭頭(往前移動頁數)，第二個元件是右箭頭(往後移動頁數)
    const newLeftArrow = document.createElement('span')
    const newRightArrow = document.createElement('span')

    newLeftArrow.classList.add('material-icons-outlined', 'arrow-icon')
    newRightArrow.classList.add('material-icons-outlined', 'arrow-icon')

    newLeftArrow.id = 'previous'
    newRightArrow.id = 'next'
    newLeftArrow.innerHTML = 'chevron_left'
    newRightArrow.innerHTML = 'navigate_next'

    // 添加兩個元件至分頁器中
    paginator.append(newLeftArrow)
    paginator.append(newRightArrow)

    // 設定兩個元件上的點擊處理器
    newRightArrow.addEventListener('click', (event) => {
      controller.dispatchNextBtnClickedAction(event)
    })

    newLeftArrow.addEventListener('click', (event) => {
      controller.dispatchPreviousBtnClickedAction(event)
    })


  },
  // 根據pageIndex所指定的頁群組來渲染分頁器一次渲染指定頁數
  renderPaginator(pageIndex) {

    // 定義起始頁數、結尾頁數
    const startIndex = pageIndex.start
    const endIndex = pageIndex.end

    // 定義一個元件來放置頁數元件
    const nextButton = document.querySelector('#next')

    // 起始頁數和結尾頁數來當for迴圈的起始值和結尾值，以此建立並渲染指定數量的頁數
    for (let page = startIndex; page <= endIndex; page++) {

      const newListItem = document.createElement('li')
      newListItem.classList.add('page-item')
      newListItem.innerHTML = `
        <a class="page-link profile-link-item" href="#" data-page=${page}>${page}</a>
      `
      newListItem.dataset.page = page
      paginator.insertBefore(newListItem, nextButton)

    }

    // 當目前所在頁群組不是最後一個頁群組時，就渲染能表示"..."的元件，代表後面還有頁數
    if (!pageIndex.isLastPageGroup) {
      const newListItem = document.createElement('span')
      newListItem.classList.add('material-icons')
      newListItem.innerHTML = 'more_horiz'
      paginator.insertBefore(newListItem, nextButton)
    }


  },
  // 根據指定的頁面(每一頁會用id來代表)來渲染分頁器上的目前頁數
  renderCurrentPage(id) {

    const pages = [...paginator.querySelectorAll('.page-item')]
    let currentPage = 0

    // 將同一群組上的所有頁數一併移除active類別並尋找指定頁面的元件
    pages.forEach(page => {
      if (page.dataset.page === id) {
        currentPage = page
      }
      page.classList.remove('active')
    })
    // 設定指定頁數的類別為active
    currentPage.classList.add('active')

  },
  // 根據資料來渲染朋友資料(data)
  renderFriendList(data) {

    let rawHTML = ''
    // 根據每位朋友的資料來渲染
    data.forEach(item => {
      rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <!-- cards -->
            <div class="card profile-card mb-4">
              <img
                src=${item.avatar}
                class="card-img-top card-avatar" alt="Friend Avatar"
                data-toggle="modal" data-target="#friend-modal" data-id=${item.id}>
              <div class ="card-body text-center">
                <h5 class ="card-title profile-card-title">${item.name + " " + item.surname}</h5>
                <i class="fa fa-star btn-show-favorite" aria-hidden="true" data-id=${item.id}></i>
              </div>
            </div>
          </div>
        </div>
      `


    });

    dataPanel.innerHTML = rawHTML

  },
  // 根據指定朋友(用id來表示朋友)來渲染出互動視窗
  renderFriendModal(id) {


    const friendName = document.querySelector('#friend-modal-name')
    const friendEmail = document.querySelector('#friend-modal-email')
    const friendBirthDay = document.querySelector('#friend-modal-birthday')
    const friendAge = document.querySelector('#friend-modal-age')
    const friendGender = document.querySelector('#friend-modal-gender')
    const friendRegion = document.querySelector('#friend-modal-region')


    axios.get(INDEX_URL + id)
      .then(response => {
        const data = response.data

        friendName.innerHTML = `${data.name} ${data.surname} `
        friendEmail.innerHTML = `email: ${data.email} `
        friendBirthDay.innerHTML = `birthday: ${data.birthday} `
        friendAge.innerHTM = `$age: ${data.age} `
        friendGender.innerHTML = `gender: ${data.gender} `
        friendRegion.innerHTML = `region: ${data.region} `
      })
      .catch(error => {
        console.log(error)
      })

  },
  // 根據關鍵字內容來渲染找不到指定朋友時的畫面
  renderNotFoundPage(dataPanel, keyword) {

    let rawHTML = ''

    rawHTML = `
      <div class="not-found-page">
          <h1>${keyword} is not found!!!</h1>
      </div>
    `
    dataPanel.innerHTML = rawHTML
  }

}

// 定義如何處理使用者發出的請求和初始化一開始畫面
// 該控制器有存三種屬性，分別為currentListType、currentPage、totalPages
// currentListType 是字串，指定目前使用的清單類型是什麼
// currentPage 是數字，指定目前使用的頁數是什麼
// totalPages 是數字，指定目前清單的總頁數

const controller = {

  currentListType: '',
  currentPage: 0,
  totalPages: 0,
  // 利用localStorage上的最愛朋友清單上來建立一開始畫面渲染和資料建立
  initialize() {

    // 設定目前頁數、所用清單類型
    this.currentPage = 1
    this.currentListType = LIST_TYPE.FavoriteFriendList

    // 獲取資料並建立一開始的最愛朋友清單
    const favoriteFriendList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
    model.listAdder(this.currentListType, favoriteFriendList)

    // 設定總頁數
    this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))



    // 當總頁數大於0才建立分頁器、朋友清單的渲染
    if (this.totalPages > 0) {
      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      view.initPaginator()
      view.initializeView(currentPageData, pageIndex)
      view.renderCurrentPage('' + this.currentPage)
    }

  },
  // 定義分派事件處理給搜尋輸入欄(Search Control)的輸入事件，當輸入開始便代表搜尋開始
  dispatchSearchControlInputedAction(event) {

    event.preventDefault()
    const target = event.target
    const keyword = target.value.trim().toLowerCase()

    // 當搜尋輸入欄從有輸入內容轉換至只剩空格或者沒有任何值時，就代表搜尋停止並且恢復搜尋前的畫面
    if (keyword.trim() === '') {

      // 重設目前所在的清單類型為搜尋前的類型、目前頁數、目前總頁數
      this.currentPage = 1
      this.currentListType = LIST_TYPE.FavoriteFriendList
      this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))

      // 將存放搜尋結果的清單清空
      model.listSetter(LIST_TYPE.FilteredFriendList, [])

      // 獲取指定清單的第一頁的資料
      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      // 根據資料來重新渲染分頁器、朋友清單
      view.initPaginator()
      view.initializeView(currentPageData, pageIndex)
      view.renderCurrentPage('' + this.currentPage)

      return
    }


    // 執行到這階段，代表搜尋輸入欄仍有輸入內容，此時會先建立分頁器一開始會有的樣子
    // 並根據搜尋結果來渲染該結果下的朋友清單和分頁器內容


    // 渲染分頁器一開始會有的樣子
    view.initPaginator()

    this.currentListType = LIST_TYPE.FilteredFriendList

    // 從朋友清單找到符合keyword的朋友，並將這些朋友放入專門存放搜尋結果的清單
    const friendList = model.listGetter(LIST_TYPE.FavoriteFriendList)
    const filteredFriends = friendList.filter(friend => {
      const fullName = friend.name + " " + friend.surname
      return fullName.trim().toLowerCase().includes(keyword)
    })

    // 將代表搜尋結果清單儲存在model層面上
    model.listSetter(this.currentListType, filteredFriends)



    // 找不到就跳到404
    if (!filteredFriends.length) {
      paginator.innerHTML = ''
      view.renderNotFoundPage(dataPanel, keyword)
      return
    }

    // 設定搜尋後的目前頁數為1
    this.currentPage = 1

    // 根據搜尋結果來設定總頁數
    this.totalPages = model.parsePage(model.listLengthGetter(LIST_TYPE.FilteredFriendList))

    // 獲取分頁器所需要的資料
    const pageIndex = model.getPageIndexByPageGroup(this.currentListType, 1)

    // 渲染分頁器、目前所在頁數、朋友清單
    view.renderPaginator(pageIndex)
    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, 1))
  },
  // 定義分派事件處理給分頁器右箭頭元件(Next Button)的點擊事件，當元件被點擊，就代表目前頁數會往後移
  dispatchNextBtnClickedAction(event) {

    // 若目前頁數為總頁數就不移動目前頁數
    if (this.currentPage === this.totalPages) {
      return
    }

    // 若目前頁數不為總頁數的話，就將目前頁數往後面移動，比如目前頁數=目前頁數+1
    const target = event.target
    this.currentPage++

    // 當目前頁數超過目前所在的頁群組，就換下一個頁群組並重新渲染分頁器
    if (this.currentPage % PAGES_PER_PAGE_GROUP === 1) {

      view.initPaginator()
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)
      view.renderPaginator(pageIndex)

    }

    // 渲染目前頁數
    view.renderCurrentPage('' + this.currentPage)


    // 根據目前頁數來渲染對應的朋友資料
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))



  },
  // 定義分派事件處理給分頁器左箭頭元件(Previous Button)的點擊事件，當元件被點擊，就代表目前頁數會往前移
  dispatchPreviousBtnClickedAction(event) {

    // 若目前頁數為第一頁就不移動目前頁數
    if (this.currentPage === 1) {
      return
    }

    // 若目前頁數不為第一頁的話，就將目前頁數往前面移動，比如目前頁數=目前頁數-1
    const target = event.target
    this.currentPage--

    // 當目前頁數超過目前所在的頁群組，就換上一個頁群組並重新渲染分頁器
    if (this.currentPage % PAGES_PER_PAGE_GROUP === 0) {

      view.initPaginator()
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)
      view.renderPaginator(pageIndex)

    }

    // 渲染目前頁數
    view.renderCurrentPage('' + this.currentPage)

    // 根據目前頁數來渲染對應的朋友資料
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))

  },
  // 定義分派事件處理給資料面板(顯示朋友清單)元件(Next Button)的點擊事件
  // 當元件上的圖像被點擊，就代表會顯示對應資料的互動視窗
  // 當元件上的星號被點擊，就代表會將對應朋友增加至最愛朋友清單或者從最愛朋友清單刪除指定朋友
  dispatchPanelClickedAction(event) {
    const target = event.target

    // 當元件上的圖像被點擊，就代表會顯示對應資料的互動視窗
    if (target.matches('.card-avatar')) {
      view.renderFriendModal(+(target.dataset.id))
    } else if (target.matches('.fa-star')) {
      // 當點擊實心星號圖示時，就在model層面上從最愛朋友清單上刪除指定朋友並重新渲染刪除後的畫面
      // 在這裡會根據最後一頁的項目是否被清光，

      // 取得刪除前的最後一頁之頁數
      const pastLastPage = this.totalPages

      // 在model層面從最愛朋友清單刪除指定朋友
      model.removeFriend(this.currentListType, +(target.dataset.id))

      // 獲取總頁數
      this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))

      // 取得刪除前的最後一頁的資料數
      const lastPageData = model.getFriendsByPage(this.currentListType, pastLastPage)

      // 在搜尋中進行刪除並把(搜尋結果上)項目全刪光時就重新渲染搜尋前的畫面並清空搜尋輸入欄
      if (this.currentListType === LIST_TYPE.FilteredFriendList && this.totalPages === 0) {
        this.currentPage = 1
        this.currentListType = LIST_TYPE.FavoriteFriendList
        searchControl.value = ''
      } else if (this.totalPages === 0) {
        // 當把最愛朋友清單上的朋友全刪光完時，就將分頁器和資料面板呈現成空值
        paginator.innerHTML = ''
        view.renderFriendList(lastPageData)
        return
      } else if (lastPageData.length === 0 && pastLastPage === this.currentPage) {
        // 當最後一頁的項目全刪光且目前頁數是最後一頁的話，就將目前所在頁數往前減
        this.currentPage--
      }

      // 獲取渲染分頁、朋友清單的資料
      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      // 渲染朋友清單、分頁器、目前頁數
      view.renderFriendList(currentPageData)
      view.initPaginator()
      view.renderPaginator(pageIndex)
      view.renderCurrentPage('' + this.currentPage)


    }

  },
  // 定義分派事件處理給分頁器頁數(顯示朋友清單)元件(Next Button)的點擊事件
  // 當對應頁數的點擊發生，就會渲染目前頁數以及對應頁數的朋友清單
  dispatchPaginatorClickedAction(event) {
    const target = event.target

    // 若不是<a>標籤就退回
    if (target.tagName !== 'A') {
      return
    }

    // 渲染目前頁數以及對應頁數的朋友清單，另外將currentPage設定數字是為了型別統一，不讓系統隨意更改為其他型別
    this.currentPage = parseInt(target.dataset.page, 10)
    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))

  },

}

// 初始化畫面和資料
controller.initialize()

// 設定資料面板(顯示朋友清單)的點擊事件綁定
dataPanel.addEventListener('click', (event) => {
  controller.dispatchPanelClickedAction(event)
})

// 設定搜尋輸入欄的點擊事件綁定
searchControl.addEventListener('input', (event) => {
  controller.dispatchSearchControlInputedAction(event)
})


// 設定分頁器的點擊事件綁定
paginator.addEventListener('click', (event) => {
  controller.dispatchPaginatorClickedAction(event)
})



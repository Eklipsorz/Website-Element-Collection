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
  removeFriend(listType, id) {

    const list = this.listGetter(listType)
    const favoriteList = this.favoriteList

    let favoriteFriendIndex = 0
    let listFriendIndex = 0

    favoriteFriendIndex = favoriteList.findIndex(item => item.id === id)
    favoriteList.splice(favoriteFriendIndex, 1)

    if (listType != LIST_TYPE.FavoriteFriendList) {
      listFriendIndex = list.findIndex(item => item.id === id)
      list.splice(listFriendIndex, 1)
    }

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

    const newLeftArrow = document.createElement('span')
    const newRightArrow = document.createElement('span')

    newLeftArrow.classList.add('material-icons-outlined', 'arrow-icon')
    newRightArrow.classList.add('material-icons-outlined', 'arrow-icon')

    newLeftArrow.id = 'previous'
    newRightArrow.id = 'next'
    newLeftArrow.innerHTML = 'chevron_left'
    newRightArrow.innerHTML = 'navigate_next'

    paginator.append(newLeftArrow)
    paginator.append(newRightArrow)

    newRightArrow.addEventListener('click', (event) => {
      controller.dispatchNextBtnClickedAction(event)
    })

    newLeftArrow.addEventListener('click', (event) => {
      controller.dispatchPreviousBtnClickedAction(event)
    })


  },
  /* 渲染分頁器，根據項目數量amount來決定渲染多少頁 */
  renderPaginator(pageIndex) {

    // const numberOfPage = Math.ceil(amount / FRIENDS_PER_PAGE)
    const startIndex = pageIndex.start
    const endIndex = pageIndex.end
    const nextButton = document.querySelector('#next')


    for (let page = startIndex; page <= endIndex; page++) {

      const newListItem = document.createElement('li')
      newListItem.classList.add('page-item')
      newListItem.innerHTML = `
        <a class="page-link profile-link-item" href="#" data-page=${page}>${page}</a>
      `
      newListItem.dataset.page = page
      paginator.insertBefore(newListItem, nextButton)

    }

    if (!pageIndex.isLastPageGroup) {
      const newListItem = document.createElement('span')
      newListItem.classList.add('material-icons')
      newListItem.innerHTML = 'more_horiz'
      paginator.insertBefore(newListItem, nextButton)
    }

    // paginator.innerHTML = rawHTML
  },
  renderCurrentPage(id) {

    const pages = [...paginator.querySelectorAll('.page-item')]
    let currentPage = 0


    pages.forEach(page => {
      if (page.dataset.page === id) {
        currentPage = page
      }
      page.classList.remove('active')
    })

    currentPage.classList.add('active')

  },
  renderFriendList(data) {

    let rawHTML = ''

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
  renderFavoriteIcon(targetIcon) {

    const currentClass = targetIcon.matches('.fa-star') ? 'fa-star' : 'fa-star-o'
    const targetClass = currentClass === 'fa-star' ? 'fa-star-o' : 'fa-star'
    targetIcon.classList.remove(currentClass)
    targetIcon.classList.add(targetClass)

  },
  renderNotFoundPage(dataPanel) {

    let rawHTML = ''

    rawHTML = `
      <div id="main">
        <div class="fof">
          <h1>Error 404</h1>
        </div>
      </div>
    `
    dataPanel.innerHTML = rawHTML
  }

}

const controller = {

  currentListType: '',
  currentPage: 0,
  totalPages: 0,
  initialize() {


    this.currentPage = 1
    this.currentListType = LIST_TYPE.FavoriteFriendList

    // 獲取資料並建立朋友清單
    const favoriteFriendList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
    model.listAdder(this.currentListType, favoriteFriendList)

    this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))



    // 第幾頁好友
    if (this.totalPages > 0) {
      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      view.initPaginator()
      view.initializeView(currentPageData, pageIndex)
      view.renderCurrentPage('' + this.currentPage)
    }

  }
  ,
  dispatchSearchControlInputedAction(event) {

    event.preventDefault()
    const target = event.target
    const keyword = target.value.trim().toLowerCase()

    if (keyword.trim() === '') {

      this.currentPage = 1

      this.currentListType = LIST_TYPE.FavoriteFriendList
      this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))

      model.listSetter(LIST_TYPE.FilteredFriendList, [])

      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      view.initPaginator()
      view.initializeView(currentPageData, pageIndex)
      view.renderCurrentPage('' + this.currentPage)

      return
    }

    view.initPaginator()

    this.currentListType = LIST_TYPE.FilteredFriendList

    const friendList = model.listGetter(LIST_TYPE.FavoriteFriendList)

    const filteredFriends = friendList.filter(friend => {
      const fullName = friend.name + " " + friend.surname
      return fullName.trim().toLowerCase().includes(keyword)
    })


    model.listSetter(this.currentListType, filteredFriends)



    // 找不到就跳到404
    if (!filteredFriends.length) {
      paginator.innerHTML = ''
      view.renderNotFoundPage(dataPanel)
      return
    }
    this.currentPage = 1
    this.totalPages = model.parsePage(model.listLengthGetter(LIST_TYPE.FilteredFriendList))
    const pageIndex = model.getPageIndexByPageGroup(this.currentListType, 1)

    view.renderPaginator(pageIndex)
    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, 1))
  },
  dispatchNextBtnClickedAction(event) {

    if (this.currentPage === this.totalPages) {
      return
    }
    const target = event.target
    this.currentPage++

    if (this.currentPage % PAGES_PER_PAGE_GROUP === 1) {

      view.initPaginator()
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)
      view.renderPaginator(pageIndex)

    }


    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))



  },
  dispatchPreviousBtnClickedAction(event) {

    if (this.currentPage === 1) {
      return
    }
    const target = event.target
    this.currentPage--

    if (this.currentPage % PAGES_PER_PAGE_GROUP === 0) {

      view.initPaginator()
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)
      view.renderPaginator(pageIndex)

    }


    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))

  },
  // 點擊頭像的事件處理器
  dispatchPanelClickedAction(event) {
    const target = event.target

    if (target.matches('.card-avatar')) {
      view.renderFriendModal(+(target.dataset.id))
    } else if (target.matches('.fa-star')) {

      const pastLastPage = this.totalPages
      model.removeFriend(this.currentListType, +(target.dataset.id))
      this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))
      const lastPageData = model.getFriendsByPage(this.currentListType, pastLastPage)


      if (this.currentListType === LIST_TYPE.FilteredFriendList && this.totalPages === 0) {
        this.currentPage = 1
        this.currentListType = LIST_TYPE.FavoriteFriendList
        searchControl.value = ''
      } else if (this.totalPages === 0) {

        paginator.innerHTML = ''
        view.renderFriendList(lastPageData)
        return
      } else if (lastPageData.length === 0 && pastLastPage === this.currentPage) {
        this.currentPage--
      }

      const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)


      view.renderFriendList(currentPageData)
      view.initPaginator()
      view.renderPaginator(pageIndex)
      view.renderCurrentPage('' + this.currentPage)

      // view.renderFriendList(model.listGetter(LIST_TYPE.FavoriteFriendList))

    }

  },
  dispatchPaginatorClickedAction(event) {
    const target = event.target

    if (target.tagName !== 'A') {
      return
    }

    this.currentPage = parseInt(target.dataset.page, 10)
    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))

  },

}

controller.initialize()

// 將事件處理器 onPanelClicked 綁定在朋友清單點擊時的事件
dataPanel.addEventListener('click', (event) => {
  controller.dispatchPanelClickedAction(event)
})

// 將事件處理器 onSearchControlInputed 綁定在搜尋輸入欄輸入時的事件
searchControl.addEventListener('input', (event) => {
  controller.dispatchSearchControlInputedAction(event)
})


// 將事件處理器 onPaginationClicked  綁定在分頁器被點擊時的事件
paginator.addEventListener('click', (event) => {
  controller.dispatchPaginatorClickedAction(event)
})



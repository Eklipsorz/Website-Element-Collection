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
  // 根據清單類型listType 來從friendList、
  getListByListType(listType) {

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
  listAdder(listType, data) {

    let list = this.getListByListType(listType)

    list.push(...data)

  },
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
  listGetter(listType) {
    return this.getListByListType(listType)
  },
  listLengthGetter(listType) {
    const list = this.getListByListType(listType)
    return list.length
  },
  getFriendsByPage(listType, page) {

    const data = this.getListByListType(listType)
    const startFriendIndex = (page - 1) * FRIENDS_PER_PAGE

    return data.slice(startFriendIndex, startFriendIndex + FRIENDS_PER_PAGE)
  },
  parsePage(amount) {
    return Math.ceil(amount / FRIENDS_PER_PAGE)
  },
  // 利用我的最愛來比對朋友清單中哪些是在我的最愛中
  matchFavoriteFriend(favoriteFriendList) {

    if (favoriteFriendList.length === 0) {
      return
    }

    this.friendList.forEach(friend => {

      friend.isFavorite = favoriteFriendList.some(item => {
        return item.id === friend.id
      })


    })

  },
  // allPages = amount / FRIENDS_PER_PAGE
  // const FRIENDS_PER_PAGE = 8
  // const PAGES_PER_PAGE_GROUP = 5
  // model.getPageIndexByPageGroup(10, 6)
  getPageIndexByPageGroup(listType, currentPage) {

    let allPages = model.parsePage(model.listLengthGetter(listType))

    const currentPageGroup = Math.ceil(currentPage / PAGES_PER_PAGE_GROUP)
    const lastPageGroup = Math.ceil(allPages / PAGES_PER_PAGE_GROUP)


    console.log(`currentPage: ${currentPageGroup}`)
    console.log(`lastGroup: ${lastPageGroup}`)
    let pageIndex = {
      isLastPageGroup: false,
      start: 1,
      end: 1
    }

    pageIndex.isLastPageGroup = currentPageGroup === lastPageGroup
    pageIndex.start = (currentPageGroup - 1) * PAGES_PER_PAGE_GROUP + 1
    pageIndex.end = pageIndex.isLastPageGroup ?
      allPages :
      pageIndex.start + PAGES_PER_PAGE_GROUP - 1


    return pageIndex

  },
  addToFavoriteFriend(id) {


    const list = this.favoriteList
    const friend = this.friendList.find(friend => friend.id === id)

    this.listAdder(LIST_TYPE.FavoriteFriendList, [friend])
    localStorage.setItem('favoriteFriends', JSON.stringify(list))

  },
  removeFavoriteFriend(id) {

    const list = this.favoriteList
    let favoriteFriendIndex = 0

    favoriteFriendIndex = list.findIndex(item => item.id === id)
    list.splice(favoriteFriendIndex, 1)

    localStorage.setItem('favoriteFriends', JSON.stringify(list))
  }
}




const view = {
  // initializeView(listType, currentPage) {
  // 初始化一開始的頁面，第一個參數是指目前頁數的資料，第二個參數是指多少筆資料
  initializeView(currentPageData, pageIndex) {

    this.renderPaginator(pageIndex)
    this.renderFriendList(currentPageData)
  },
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


  }
  ,
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

      const iconContext = item.isFavorite ?
        `<i class="fa fa-star btn-show-favorite" aria-hidden="true" data-id=${item.id}></i>` : `<i class="fa fa-star-o btn-show-favorite" aria-hidden="true" data-id=${item.id}></i>`

      rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <!-- cards -->
          <div class="card profile-card mb-4">
            <img
              src=${item.avatar}
              class="card-img-top card-avatar" alt="Friend Avatar" 
              data-toggle="modal" data-target="#friend-modal" data-id=${item.id}>
            <div class="card-body text-center">
              <h5 class="card-title profile-card-title">${item.name + " " + item.surname}</h5>
              ${iconContext}
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

        friendName.innerHTML = `${data.name} ${data.surname}`
        friendEmail.innerHTML = `email: ${data.email}`
        friendBirthDay.innerHTML = `birthday: ${data.birthday}`
        friendAge.innerHTM = `$age: ${data.age}`
        friendGender.innerHTML = `gender: ${data.gender}`
        friendRegion.innerHTML = `region: ${data.region}`
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
  initialize(INDEX_URL) {
    axios.get(INDEX_URL)
      .then(response => {

        this.currentPage = 1

        this.currentListType = LIST_TYPE.NormalFriendList

        // 獲取資料並建立朋友清單
        model.listAdder(this.currentListType, response.data.results)
        this.totalPages = model.parsePage(model.listLengthGetter(LIST_TYPE.NormalFriendList))

        // 設定我的最愛
        const favoriteFriendList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
        model.listSetter(LIST_TYPE.FavoriteFriendList, favoriteFriendList)
        model.matchFavoriteFriend(favoriteFriendList)

        // 第幾頁好友

        if (this.totalPages > 0) {
          const currentPageData = model.getFriendsByPage(this.currentListType, this.currentPage)
          const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

          view.initPaginator()
          view.initializeView(currentPageData, pageIndex)
          view.renderCurrentPage('' + this.currentPage)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  ,
  dispatchSearchControlInputedAction(event) {

    event.preventDefault()
    const target = event.target
    const keyword = target.value.trim().toLowerCase()

    if (keyword.trim() === '') {

      this.currentPage = 1

      this.currentListType = LIST_TYPE.NormalFriendList
      this.totalPages = model.parsePage(model.listLengthGetter(this.currentListType))


      model.listSetter(LIST_TYPE.FilteredFriendList, [])

      const currentPageData = model.getFriendsByPage(this.currentListType, 1)
      const pageIndex = model.getPageIndexByPageGroup(this.currentListType, this.currentPage)

      view.initPaginator()
      view.initializeView(currentPageData, pageIndex)
      view.renderCurrentPage('' + this.currentPage)

      return
    }

    view.initPaginator()

    this.currentListType = LIST_TYPE.FilteredFriendList

    const friendList = model.listGetter(LIST_TYPE.NormalFriendList)

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
    } else if (target.matches('.fa-star-o')) {
      // 放進我的最愛
      view.renderFavoriteIcon(target)
      model.addToFavoriteFriend(+(target.dataset.id))
    } else if (target.matches('.fa-star')) {
      // 移除我的最愛
      view.renderFavoriteIcon(target)
      model.removeFavoriteFriend(+(target.dataset.id))
    }

  },
  dispatchPaginatorClickedAction(event) {
    const target = event.target

    if (target.tagName !== 'A') {
      return
    }
    console.log(target)
    this.currentPage = target.dataset.page

    view.renderCurrentPage('' + this.currentPage)
    view.renderFriendList(model.getFriendsByPage(this.currentListType, this.currentPage))

  },

}

controller.initialize(INDEX_URL)

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



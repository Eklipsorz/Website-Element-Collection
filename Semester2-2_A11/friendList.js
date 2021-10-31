// 清單類別
const LIST_TYPE = {
  NormalFriendList: "NormalFriendList",
  FilteredFriendList: "FilteredFriendList",
  FavoriteFriendList: "FavoriteFriendList"
}

// 存放所有朋友
const dataPanel = document.querySelector('#data-panel')

// 搜尋輸入欄
const searchControl = document.querySelector('#search-bar-control')
// 分頁器
const paginator = document.querySelector('#paginator')

// 定義 API Server 
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/users/'

const FRIENDS_PER_PAGE = 8



const model = {
  // friend and isFavorite
  friendList: [],
  favoriteList: [],
  filteredFriendList: [],

  listAdder(listType, data) {

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

    list.push(...data)

  },
  listSetter(listType, newList) {

    if (listType === LIST_TYPE.NormalFriendList) {
      this.friendList = newList
    } else {
      this.filteredFriendList = newList
    }
  },
  listGetter(listType) {
    return listType === LIST_TYPE.NormalFriendList ?
      this.friendList :
      this.filteredFriendList
  },
  listLengthGetter(listType) {
    return listType === LIST_TYPE.NormalFriendList ?
      this.friendList.length :
      this.filteredFriendList.length
  },
  getFriendsByPage(listType, page) {
    const data = listType === LIST_TYPE.NormalFriendList ?
      this.listGetter(LIST_TYPE.NormalFriendList) :
      this.listGetter(LIST_TYPE.FilteredFriendList)


    const startFriendIndex = (page - 1) * FRIENDS_PER_PAGE

    return data.slice(startFriendIndex, startFriendIndex + FRIENDS_PER_PAGE)
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

  }
}




const view = {
  initializeView(listType) {

    this.renderPaginator(model.listLengthGetter(listType))
    this.renderFriendList(model.getFriendsByPage(listType, 1))
  },
  /* 渲染分頁器，根據項目數量amount來決定渲染多少頁 */
  renderPaginator(amount) {

    const numberOfPage = Math.ceil(amount / FRIENDS_PER_PAGE)
    let rawHTML = ''

    for (let page = 1; page <= numberOfPage; page++) {
      rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
      `
    }

    paginator.innerHTML = rawHTML
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

  initialize(INDEX_URL) {
    axios.get(INDEX_URL)
      .then(response => {

        const favoriteFriendList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
        model.listAdder(LIST_TYPE.NormalFriendList, response.data.results)
        model.matchFavoriteFriend(favoriteFriendList)
        view.initializeView(LIST_TYPE.NormalFriendList)

      })
      .catch(error => {
        console.log(error)
      })
  },
  dispatchSearchControlInputedAction(event) {

    event.preventDefault()
    const target = event.target
    const keyword = target.value.trim().toLowerCase()

    if (keyword.trim() === '') {

      model.listSetter(LIST_TYPE.FilteredFriendList, [])
      view.initializeView(LIST_TYPE.NormalFriendList)

      return
    }

    const friendList = model.listGetter(LIST_TYPE.NormalFriendList)

    const filteredFriends = friendList.filter(friend => {
      const fullName = friend.name + " " + friend.surname
      return fullName.trim().toLowerCase().includes(keyword)
    })

    model.listSetter(LIST_TYPE.FilteredFriendList, filteredFriends)
    view.renderPaginator(model.listLengthGetter(this.currentListType))

    // 找不到就跳到404
    if (!filteredFriends.length) {

      view.renderNotFoundPage(dataPanel)
      return

    }
    view.renderFriendList(model.getFriendsByPage(this.currentListType, 1))
  }

}

controller.initialize(INDEX_URL)

// 將事件處理器 onPanelClicked 綁定在朋友清單點擊時的事件
dataPanel.addEventListener('click', onPanelClicked)

// 將事件處理器 onSearchControlInputed 綁定在搜尋輸入欄輸入時的事件
searchControl.addEventListener('input', (event) => {
  controller.dispatchSearchControlInputedAction(event)
})


// 將事件處理器 onPaginationClicked  綁定在分頁器被點擊時的事件
paginator.addEventListener('click', onPaginatorClicked)


// 點擊頭像的事件處理器
function onPanelClicked(event) {

  const target = event.target

  if (target.matches('.card-avatar')) {
    showFriendModal(+(target.dataset.id))
  } else if (target.matches('.btn-show-favorite')) {



    addToFavoriteFriend(+(target.dataset.id))

  }

}






function onPaginatorClicked(event) {

  let currentPage = ''
  const target = event.target

  if (target.tagName !== 'A') {
    return
  }

  currentPage = target.dataset.page
  renderFriendList(getFriendsByPage(currentPage))

}


/* FIXME: 會從預設頁面轉換至正確頁面，正確來說是直接正確頁面，而非轉換*/
// 設定點選後的互動視窗之內容
function showFriendModal(id) {

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



}





function addToFavoriteFriend(id) {


  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friendList.find(friend => friend.id === id)

  if (list.some(item => item.id === id)) {
    return alert('此朋友已加入至收藏清單中!!')
  }

  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))


}
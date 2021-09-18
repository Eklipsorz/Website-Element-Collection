// 存放所有朋友
const dataPanel = document.querySelector('#data-panel')
// 搜尋表單(包含輸入欄、按鈕)
const searchForm = document.querySelector('#search-form')
// 搜尋表單中的輸入欄
const searchInput = document.querySelector('#search-input')
// 分頁器
const paginator = document.querySelector('#paginator')

// 定義 API Server 
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/users/'

const FRIENDS_PER_PAGE = 8


let filteredFriends = []
const friendList = []


// 從API撈資料並放入friendList
axios.get(INDEX_URL)
  .then(response => {

    friendList.push(...response.data.results)

    renderPaginator(friendList.length)
    renderFriendList(getFriendsByPage(1))

  })
  .catch(error => {
    console.log(error)
  })



// 將事件處理器 onPanelClicked 綁定在朋友清單點擊時的事件
dataPanel.addEventListener('click', onPanelClicked)

// 將事件處理器 onSearchFormSubmitted 綁定在搜尋輸入欄提交時的事件
searchForm.addEventListener('submit', onSearchFormSubmitted)

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

// 搜尋表單提交事件處理器
function onSearchFormSubmitted(event) {


  event.preventDefault()
  const warningIcon = document.querySelector('#search-form .search-input-warning-icon')



  const keyword = searchInput.value.trim().toLowerCase()

  if (keyword.trim() === '') {
    console.log('hi')
    searchInput.style.setProperty('--search-input-border-color', '#FF665A')
    warningIcon.style.setProperty('--search-input-warning-icon-display', ' ')
    return
  }


  filteredFriends = friendList.filter(friend => {
    const fullName = friend.name + " " + friend.surname
    return fullName.trim().toLowerCase().includes(keyword)
  })

  if (!filteredFriends.length) {

    alert(`我們找不到名為${keyword}的朋友，抱歉`)
    return
  }

  renderFriendList(getFriendsByPage(1))
  renderPaginator(filteredFriends.length)
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

/* 取得對應頁面的項目，並判定根據是否正在搜尋而變動(要渲染的)資料的來源處 */
function getFriendsByPage(page) {

  const data = filteredFriends.length ? filteredFriends : friendList
  const startFriendIndex = (page - 1) * FRIENDS_PER_PAGE

  return data.slice(startFriendIndex, startFriendIndex + FRIENDS_PER_PAGE)

}

/* 渲染分頁器，根據項目數量amount來決定渲染多少頁 */
function renderPaginator(amount) {

  const numberOfPage = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
      `
  }

  paginator.innerHTML = rawHTML
}


// 根據data內容來渲染朋友清單頁面
function renderFriendList(data) {
  let rawHTML = ''

  data.forEach(item => {



    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <!-- cards -->
          <div class="card">
            <img
              src=${item.avatar}
              class="card-img-top card-avatar" alt="Friend Avatar" 
              data-toggle="modal" data-target="#friend-modal"data-id=${item.id}>
            <div class="card-body text-center">
              <h5 class="card-title">${item.name + " " + item.surname}</h5>
              <button class="btn btn-outline-danger btn-show-favorite" data-id=${item.id}>LIKE</button>
            </div>
        
          </div>
        </div>
      </div>
    `


  });

  dataPanel.innerHTML = rawHTML

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
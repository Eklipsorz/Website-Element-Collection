// 存放電影的空間
const dataPanel = document.querySelector('#data-panel')

// 搜尋表單(包含輸入欄、按鈕)
const searchForm = document.querySelector('#search-form')

// 搜尋表單中的輸入欄
const searchInput = document.querySelector('#search-input')

// 分頁器
const paginator = document.querySelector('#paginator')

// 存放顯示模式按鈕的區塊
const modePanel = document.querySelector('#mode-panel')

// 設定API Server
const BASE_URL = 'https://movie-list.alphacamp.io'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/movies/'

// 使用 POSTER API
const POSTER_URL = BASE_URL + '/posters/'

// 定義每頁要顯示多少個項目
const MOVIES_PER_PAGE = 12

// 定義目前頁數
let currentPage = 1

// 設定Data-Panel的顯示模式(主要有card和list這兩種模式)
let currentMode = 'card'

// 存放從API Server下載回來的電影
const movies = []

// 存放搜尋結果
let filteredMovies = []


// Part1： 建立一開始的畫面、資料構建、元件的事件綁定


axios.get(INDEX_URL)
  .then(response => {

    movies.push(...response.data.results)

    // 顯示總頁數
    renderPaginator(movies.length)
    // 顯示第一頁
    renderMovieList(getMoviesByPage(1), currentMode)
  })
  .catch(error => {
    console.log(error)
  })

// 將 onPanelClicked 綁定在資料面板(顯示電影清單)的點擊事件
dataPanel.addEventListener('click', onPanelClicked)

// 將 onSearchFormSubmitted 綁定在搜尋輸入欄的提交事件
searchForm.addEventListener('submit', onSearchFormSubmitted)

// 將 onPaginatorClicked 綁定在分頁器的點擊事件
paginator.addEventListener('click', onPaginatorClicked)

// 將 onModePanelClicked 綁定在模式面板(存放清單和卡片模式的容器)的點擊事件
modePanel.addEventListener('click', onModePanelClicked)


// Part2： 定義部分商業邏輯、渲染部分

// 根據顯示模式(卡片、清單)來渲染電影清單
function renderMovieList(data, mode) {
  let rawHTML = ''

  switch (mode) {
    case 'list':
      // 獲取以清單模式來渲染的HTML
      rawHTML += getRawHTMLByList(data)
      break
    case 'card':
      // 獲取以卡片模式來渲染的HTML
      rawHTML += getRawHTMLByCard(data)
      break
  }


  dataPanel.innerHTML = rawHTML
}

// 獲取以清單模式來渲染的HTML
function getRawHTMLByList(data) {

  let rawHTML = `
    <div class="container">
  `

  data.forEach(item => {

    rawHTML += `
          <hr>
          <div class="row mt-3">
            <div class="col-8">
              <h5>${item.title}</h5>
            </div>
            
            <div class="col">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id=${item.id}>More</button>
                <button class="btn btn-info btn-show-favorite" data-id=${item.id}>+</button>
            </div>
          </div>  

    `
  })

  rawHTML += '</div>'

  return rawHTML

}

// 獲取以卡片模式來渲染的HTML
function getRawHTMLByCard(data) {

  let rawHTML = ''

  data.forEach(item => {

    rawHTML += `
     <div class="col-sm-3">
        <div class="mb-2">
          <!-- cards -->
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-show-favorite" data-id=${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
    `


  })


  return rawHTML

}



/* 取得對應頁面的項目，並判定根據是否正在搜尋而變動(要渲染的)資料的來源處 */
function getMoviesByPage(page) {

  /* 當filteredMovie.length 等於0時就表示沒在進行搜尋，否則就代表正在搜尋 */
  const data = filteredMovies.length ? filteredMovies : movies
  const startPageIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startPageIndex, startPageIndex + MOVIES_PER_PAGE)

}

/* 渲染分頁器，根據項目數量amount來決定渲染多少頁 */
function renderPaginator(amount) {

  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  // 除了預設第一頁先被點擊以外，剩餘頁數保持未點擊的狀態
  for (let page = 1; page <= numberOfPages; page++) {

    rawHTML += `
        <li class="page-item ${page === 1 ? "active" : ""}"> 
          <a class="page-link" href="#" data-page=${page}>${page}</a>
        </li>
      `
  }

  paginator.innerHTML = rawHTML

}


// 渲染每個電影的互動視窗
function showMovieModal(id) {

  const modalTitle = document.querySelector('#movie-modal-title')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-description')
  const modalImage = document.querySelector('#movie-modal-image')


  axios.get(INDEX_URL + id).then(response => {

    const data = response.data.results

    modalTitle.innerHTML = data.title
    modalDate.innerHTML = data.release_date
    modalDescription.innerHTML = data.description
    modalImage.innerHTML = `
        <img src = ${POSTER_URL + data.image} alt = "moive-poster" class="img-fuid">
          `
  })

}

// 將指定電影(以id來表示)加進收藏清單中
function addToFavoriteMovies(id) {

  // 獲取最愛電影清單，避免使用者關掉頁面或者瀏覽器而清掉他原本選定的電影
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  // 檢查電影是否在收藏清單中
  if (list.some(item => item.id === id)) {
    return alert('此電影已在收藏清單中')
  }

  list.push(movie)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))


}

// 重新渲染目前頁數
function renderCurrentPage(targetPage) {

  const activePage = paginator.querySelector('.page-item.active')

  activePage.classList.remove('active')
  targetPage.classList.add('active')

}

// 重新渲染目前顯示模式
function renderModeIcon(targetIcon) {
  const currentActiveIcon = document.querySelector('.mode-switch-btn.active')

  currentActiveIcon.classList.remove('active')
  targetIcon.classList.add('active')
}



// Part3： 定義事件處理的內容


// 資料面板的點擊事件處理內容
function onPanelClicked(event) {

  const target = event.target

  // 當使用者點擊more按鈕時，就顯示對應的互動視窗
  if (target.matches('.btn-show-movie')) {

    showMovieModal(+(target.dataset.id))

  } else if (target.matches('.btn-show-favorite')) {
    // 當使用者點擊收藏時，就加進收藏清單中

    addToFavoriteMovies(+(target.dataset.id))

  }


}



/* 搜尋表單的提交事件內容 */
function onSearchFormSubmitted(event) {

  // 移除預設行為
  event.preventDefault()

  // 根據keyword來從電影清單中找尋與keyword相關的電影
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })

  // 找不到就重渲染成搜尋前的畫面、輸入欄清空、給予錯誤訊息
  if (!filteredMovies.length) {

    // 重新渲染成搜尋前的畫面
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1), currentMode)

    // 輸入欄清空
    searchInput.value = ""

    // 錯誤訊息
    alert(`抱歉，我們找不到與${keyword}相關的電影`)
    return
  }

  // 根據目前搜尋結果來渲染電影項目、分頁器
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1), currentMode)

}




/* 分頁器的點擊事件內容 */
function onPaginatorClicked(event) {


  const target = event.target

  // 當點擊不是<a>標籤就返回
  if (target.tagName !== 'A') {
    return
  }

  // 根據點擊的頁數來重新渲染頁數和電影清單內容
  currentPage = target.dataset.page
  renderCurrentPage(target.parentElement)
  renderMovieList(getMoviesByPage(currentPage), currentMode)


}

// 模式面板的點擊事件處理內容
function onModePanelClicked(event) {

  const target = event.target

  // 當使用者點擊模式按鈕時，就按照點擊模式來切換成對應模式的內容
  if (target.matches('.mode-switch-btn')) {
    currentMode = target.dataset.mode
    renderModeIcon(target)
    renderMovieList(getMoviesByPage(currentPage), currentMode)
  }


}
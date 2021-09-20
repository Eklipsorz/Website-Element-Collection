// 存放電影的空間
const dataPanel = document.querySelector('#data-panel')
// 搜尋表單(包含輸入欄、按鈕)
const searchForm = document.querySelector('#search-form')
// 搜尋表單中的輸入欄
const searchInput = document.querySelector('#search-input')
// 分頁器
const paginator = document.querySelector('#paginator')

const BASE_URL = 'https://movie-list.alphacamp.io'

// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/movies/'
// 使用 POSTER API
const POSTER_URL = BASE_URL + '/posters/'

// 定義每頁要顯示多少個項目
const MOVIES_PER_PAGE = 12


const movies = []
let filteredMovies = []
const directors = []


axios.get(INDEX_URL)
  .then(response => {

    movies.push(...response.data.results)

    // 顯示總頁數
    renderPaginator(movies.length)
    // 顯示第一頁
    renderMovieList(getMoviesByPage(1))
  })
  .catch(error => {
    console.log(error)
  })


dataPanel.addEventListener('click', onPanelClicked)
searchForm.addEventListener('submit', onSearchFormSubmitted)
paginator.addEventListener('click', onPaginatorClicked)

function renderMovieList(data) {
  let rawHTML = ''

  // console.log(data)
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


  });

  dataPanel.innerHTML = rawHTML
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

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
			<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
		`
  }

  paginator.innerHTML = rawHTML

}




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
        <img src=${POSTER_URL + data.image} alt="moive-poster" class="img-fuid">
    `
  })




}





function onPanelClicked(event) {

  const target = event.target

  if (target.matches('.btn-show-movie')) {

    showMovieModal(+(target.dataset.id))

  } else if (target.matches('.btn-show-favorite')) {


    addToFavoriteMovies(+(target.dataset.id))

  }


}

function addToFavoriteMovies(id) {

  // 獲取最愛電影清單，避免使用者關掉頁面或者瀏覽器而清掉他原本選定的電影
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(item => item.id === id)) {
    return alert('此電影已在收藏清單中')
  }

  list.push(movie)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))


}

/* 搜尋表單提交事件：內容 */
function onSearchFormSubmitted(event) {

  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()


  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })


  if (!filteredMovies.length) {
    alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  // 渲染目前篩選的項目、分頁器
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

}



/* 分頁器點擊事件：當使用點選指定頁數時，就會依照指定頁數來印出對應項目 */
function onPaginatorClicked(event) {

  let currentPage = 0
  const target = event.target

  if (target.tagName !== 'A') {
    return
  }

  currentPage = target.dataset.page
  renderMovieList(getMoviesByPage(currentPage))


}
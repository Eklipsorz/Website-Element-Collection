// 存放電影的空間
const dataPanel = document.querySelector('#data-panel')
// 搜尋表單(包含輸入欄、按鈕)
const searchForm = document.querySelector('#search-form')
// 搜尋表單中的輸入欄
const searchInput = document.querySelector('#search-input')

const BASE_URL = 'https://movie-list.alphacamp.io'
// 使用 INDEX API
const INDEX_URL = BASE_URL + '/api/v1/movies/'
// 使用 POSTER API
const POSTER_URL = BASE_URL + '/posters/'

const movies = []
const directors = []


axios.get(INDEX_URL)
  .then(response => {
    const allMovieData = response.data.results
    movies.push(...allMovieData)
    renderMovieList(movies)
  })
  .catch(error => {
    console.log(error)
  })


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


function showMovieModal(id) {
  /*
  id="movie-modal-title"
  id="movie-modal-image"
  id="movie-modal-date"
  id="movie-description"
  */


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

dataPanel.addEventListener('click', onPanelClicked)
searchForm.addEventListener('submit', onSearchFormSubmitted)



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

function onSearchFormSubmitted(event) {

  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  let filteredMovies = []

  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })


  if (!filteredMovies.length) {
    alert('`您輸入的關鍵字：${keyword} 沒有符合條件的電影`')
  }

  renderMovieList(filteredMovies)
}

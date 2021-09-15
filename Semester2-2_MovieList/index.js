const dataPanel = document.querySelector('#data-panel')


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
              <button class="btn btn-info btn-show-favorite">+</button>
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

function onPanelClicked(event) {

  const target = event.target

  if (target.matches('.btn-show-movie')) {

    const movieId = +(target.dataset.id)
    showMovieModal(movieId)
  }


}

dataPanel.addEventListener('click', onPanelClicked)
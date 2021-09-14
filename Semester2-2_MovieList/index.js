const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []

axios.get(INDEX_URL)
  .then(response => {
    const allMovieData = response.data.results
    movies.push(...allMovieData)


  })
  .catch(error => {
    console.log(error)
  })
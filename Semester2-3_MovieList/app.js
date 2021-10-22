
// define a express app
const express = require('express')

const app = express()


// define port and server settings
const port = 3500



const expbars = require('express-handlebars')
const movieList = require('./movieList.json')

app.engine('handlebars', expbars({ defaultLayout: 'main' }))
app.set('views', process.cwd() + '/views')
app.set('view engine', 'handlebars')


// app.use(express.static('public'))
app.use('/', express.static('public'))

// app.use('/', express.static(process.cwd() + '/public/stylesheets'))

// define some routes

app.get('/', (req, res) => {

  res.render('index', { movie: movieList.results })

})


app.get('/movies/:id', (req, res) => {

  // const movieId = Number(req.params.id) - 1
  const movie = movieList.results.find(movie => movie.id.toString() === req.params.id)

  res.render('show', { movie: movie })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const filteredMoives = movieList.results.filter(movie => {
    return movie.title.toLowerCase().includes(keyword.toLowerCase())
  })

  res.render('index', { movie: filteredMoives, keyword: keyword })

})



// start to listen
app.listen(port, () => {
  console.log(`Express server is listening at port ${port}`)
})

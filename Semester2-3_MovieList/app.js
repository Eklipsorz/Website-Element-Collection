
// define a express app
const express = require('express')
const app = express()


// define port and server settings
const port = 3500



const expbars = require('express-handlebars')
app.engine('handlebars', expbars({ defaultLayout: 'main' }))
app.set('views', process.cwd() + '/views')
app.set('view engine', 'handlebars')


// app.use(express.static('public'))
app.use('/', express.static('public'))

// app.use('/', express.static(process.cwd() + '/public/stylesheets'))

// define some routes

app.get('/', (req, res) => {

  const movieOne = {
    id: 231,
    imageURL: "https://movie-list.alphacamp.io/posters/c9XxwwhPHdaImA2f1WEfEsbhaFB.jpg",
    movieTitle: "Jurassic World: Fallen Kingdom"
  }

  res.render('index', { movie: movieOne })
})



// start to listen
app.listen(port, () => {
  console.log(`Express server is listening at port ${port}`)
})


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



// start to listen
app.listen(port, () => {
  console.log(`Express server is listening at port ${port}`)
})

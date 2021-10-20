
// define a express app
const express = require('express')
const app = express()


// define port and server settings
const port = 3500



const expbars = require('express-handlebars')
app.engine('handlebars', expbars({ defaultLayout: 'main' }))
app.set('views', process.cwd() + '/views')
app.set('view engine', 'handlebars')


// define some routes

app.get('/', (req, res) => {
  res.render('index')
})



// start to listen
app.listen(port, () => {
  console.log(`Express server is listening at port ${port}`)
})

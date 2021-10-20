
// define a express app
const express = require('express')
const app = express()

// define port and server settings
const port = 3500


// define some routes

app.get('/', (req, res) => {
  res.send(`hi everyone`)
})



// start to listen
app.listen(port, () => {
  console.log(`Express server is listening at port ${port}`)
})

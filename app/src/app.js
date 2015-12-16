'use strict'
let express = require('express')
let bodyParser = require('body-parser')

let app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})
app.get('/ping', (req, res) => {
  res.send('Pong')
})
app.post('/reflection', (req, res) => {
  res.send(req.body)
})

module.exports = app

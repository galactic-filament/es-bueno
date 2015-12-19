'use strict'
let express = require('express')
let bodyParser = require('body-parser')
let Sequelize = require('sequelize')

let sequelize = new Sequelize('postgres', 'postgres', '', {
  host: 'db',
  dialect: 'postgres',
  logging: false
})

let app = express()
app.use(bodyParser.json())

let Post = sequelize.define('Post', {
  body: Sequelize.STRING
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})
app.get('/ping', (req, res) => {
  res.send('Pong')
})
app.post('/reflection', (req, res) => {
  res.send(req.body)
})
app.post('/posts', (req, res) => {
  sequelize.sync().then(() => {
    return Post.create({
      body: res.body
    })
  }).then((post) => {
    res.send({ id: post.id })
  })
})

module.exports = app

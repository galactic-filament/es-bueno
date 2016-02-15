'use strict'
let express = require('express')
let bodyParser = require('body-parser')
let Sequelize = require('sequelize')

let dbHost = 'db'
if (process.env['ENV'] === 'travis') {
  dbHost = 'localhost'
}
let sequelize = new Sequelize('postgres', 'postgres', '', {
  host: dbHost,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  }
})

let app = express()
app.use(bodyParser.json())

let Post = sequelize.define('post', {
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
  Post.create({
    body: req.body.body
  }).then((post) => {
    res.send({ id: post.id })
  }).catch((err) => {
    res.status(500).send(err.message)
  })
})
app.get('/post/:id', (req, res) => {
  Post.findById(req.params.id).then((post) => {
    res.send(post)
  })
})
app.delete('/post/:id', (req, res) => {
  Post.findById(req.params.id).then((post) => {
    Post.destroy({
      where: { id: post.id }
    }).then(() => {
      res.send({})
    })
  })
})

module.exports = app

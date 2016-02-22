'use strict'
let express = require('express')
let bodyParser = require('body-parser')
let Sequelize = require('sequelize')
let defaultRouter = require('./default')
let postsRouter = require('./posts')

// express init
let app = express()
app.use(bodyParser.json())

// db init
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

// routes
app.use('/', defaultRouter)
app.use('/', postsRouter(sequelize))

module.exports = app

'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const defaultRouter = require('./default')
const postsRouter = require('./posts')
const winston = require('winston')

// express init
const app = express()
app.use(bodyParser.json())
if (process.env['REQUEST_LOGGING']) {
  app.use((req, res, next) => {
    winston.info('Url hit', {
      contentType: req.header('content-type'),
      method: req.method,
      url: req.originalUrl,
      body: JSON.stringify(req.body)
    })
    next()
  })
}

// db init
const dbHost = process.env['DATABASE_HOST']
const sequelize = new Sequelize('postgres', 'postgres', '', {
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

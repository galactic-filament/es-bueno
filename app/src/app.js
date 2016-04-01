'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const defaultRouter = require('./default')
const postsRouter = require('./posts')

// express init
const app = express()
app.use(bodyParser.json())

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

'use strict'
const app = require('./src/app')
const winston = require('winston')

const server = app.listen(80, () => winston.info('Listening on 80'))
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})

'use strict'
let app = require('./src/app')

const server = app.listen(80)
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})

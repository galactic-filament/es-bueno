'use strict'
let express = require('express')

let router = express.Router()

router.get('/', (req, res) => {
  res.set('Content-type', 'text/plain').send('Hello, world!')
})
router.get('/ping', (req, res) => {
  res.set('Content-type', 'text/plain').send('Pong')
})
router.post('/reflection', (req, res) => {
  res.set('Content-type', 'application/json').send(req.body)
})

module.exports = router

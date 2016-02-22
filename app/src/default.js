'use strict'
let express = require('express')

let router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello, world!')
})
router.get('/ping', (req, res) => {
  res.send('Pong')
})
router.post('/reflection', (req, res) => {
  res.send(req.body)
})

module.exports = router

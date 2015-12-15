'use strict'
let assert = require('assert')
let request = require('supertest')
let app = require('../src/app')

describe('Homepage', () => {
  it('Should return standard greeting', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        assert.equal(200, res.status)
        assert.equal('Hello, world!', res.text)
        done()
      })
  })
})

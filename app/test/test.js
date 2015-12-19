'use strict'
let assert = require('assert')
let request = require('supertest')
let app = require('../src/app')

describe('Homepage', () => {
  it('Should return standard greeting', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(200, res.status)
        assert.equal('Hello, world!', res.text)
        done()
      })
  })
})
describe('Ping endpoint', () => {
  it('Should respond to standard ping', (done) => {
    request(app)
      .get('/ping')
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(200, res.status)
        assert.equal('Pong', res.text)
        done()
      })
  })
})
describe('Json reflection', () => {
  it('Should return identical Json in response as provided by request', (done) => {
    let body = { greeting: 'Hello, world!' }
    request(app)
      .post('/reflection')
      .send(body)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(200, res.status)
        assert.equal(body.greeting, res.body.greeting)
        done()
      })
  })
})
describe('Post creation endpoint', () => {
  it('Should return the new post\'s id', (done) => {
    let body = { body: 'Hello, world!' }
    request(app)
      .post('/posts')
      .send(body)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(200, res.status)
        assert.equal('id' in res.body, true)
        assert.equal(typeof res.body.id === 'number', true)
        done()
      })
  })
})

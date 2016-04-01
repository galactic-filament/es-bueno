'use strict'
const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const HTTPStatus = require('http-status')

describe('Homepage', () => {
  it('Should return standard greeting', (done) => {
    request(app)
      .get('/')
      .expect(HTTPStatus.OK)
      .expect('Hello, world!')
      .end((err) => {
        assert.equal(err, null)
        done()
      })
  })
})
describe('Ping endpoint', () => {
  it('Should respond to standard ping', (done) => {
    request(app)
      .get('/ping')
      .expect(HTTPStatus.OK)
      .expect('Pong')
      .end((err) => {
        assert.equal(err, null)
        done()
      })
  })
})
describe('Json reflection', () => {
  it('Should return identical Json in response as provided by request', (done) => {
    const body = { greeting: 'Hello, world!' }
    request(app)
      .post('/reflection')
      .send(body)
      .expect(HTTPStatus.OK)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(body.greeting, res.body.greeting)
        done()
      })
  })
})

'use strict'
let assert = require('assert')
let request = require('supertest')
let app = require('../src/app')

let createPost = (body, cb) => {
  request(app)
    .post('/posts')
    .send(body)
    .end((err, res) => {
      assert.equal(err, null)
      assert.equal(200, res.status, res.text)
      assert.equal('id' in res.body, true)
      assert.equal(typeof res.body.id === 'number', true)
      cb(res.body)
    })
}

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
    createPost(body, () => {
      done()
    })
  })
})
describe('Post endpoint', () => {
  it('Should return a post', (done) => {
    let body = { body: 'Hello, world!' }
    createPost(body, (post) => {
      request(app)
        .get(`/post/${post.id}`)
        .end((err, res) => {
          assert.equal(err, null)
          assert.equal(200, res.status)
          assert.equal(body.body, res.body.body)
          done()
        })
    })
  })
  it('Should delete a post', (done) => {
    let body = { body: 'Hello, world!' }
    createPost(body, (post) => {
      request(app)
        .delete(`/post/${post.id}`)
        .end((err, res) => {
          assert.equal(err, null)
          assert.equal(200, res.status)
          done()
        })
    })
  })
  it('Should update a post', (done) => {
    let createBody = { body: 'Hello, world!' }
    createPost(createBody, (post) => {
      let putBody = { body: 'Jello, world!' }
      request(app)
        .put(`/post/${post.id}`)
        .send(putBody)
        .end((err, res) => {
          assert.equal(err, null)
          assert.equal(200, res.status)
          assert.equal(putBody.body, res.body.body)
          done()
        })
    })
  })
})

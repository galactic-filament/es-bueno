'use strict'
const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const HTTPStatus = require('http-status')

const createPost = (body, cb) => {
  request(app)
    .post('/posts')
    .send(body)
    .expect(HTTPStatus.CREATED)
    .end((err, res) => {
      assert.equal(err, null)
      assert.equal('id' in res.body, true)
      assert.equal(typeof res.body.id === 'number', true)
      cb(res.body)
    })
}

describe('Post creation endpoint', () => {
  it('Should return the new post\'s id', (done) => {
    const body = { body: 'Hello, world!' }
    createPost(body, () => done())
  })
})
describe('Post endpoint', () => {
  it('Should return a post', (done) => {
    const body = { body: 'Hello, world!' }
    createPost(body, (post) => {
      request(app)
        .get(`/post/${post.id}`)
        .expect(HTTPStatus.OK)
        .end((err, res) => {
          assert.equal(err, null)
          assert.equal(body.body, res.body.body)
          done()
        })
    })
  })
  it('Should delete a post', (done) => {
    const body = { body: 'Hello, world!' }
    createPost(body, (post) => {
      request(app)
        .delete(`/post/${post.id}`)
        .expect(HTTPStatus.OK)
        .end((err) => {
          assert.equal(err, null)
          done()
        })
    })
  })
  it('Should update a post', (done) => {
    const createBody = { body: 'Hello, world!' }
    createPost(createBody, (post) => {
      const putBody = { body: 'Jello, world!' }
      request(app)
        .put(`/post/${post.id}`)
        .send(putBody)
        .expect(HTTPStatus.OK)
        .end((err, res) => {
          assert.equal(err, null)
          assert.equal(putBody.body, res.body.body)
          done()
        })
    })
  })
})

'use strict'
let assert = require('assert')
let request = require('supertest')
let app = require('../src/app')
let HTTPStatus = require('http-status')

let createPost = (body, cb) => {
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
    let body = { body: 'Hello, world!' }
    createPost(body, () => done())
  })
})
describe('Post endpoint', () => {
  it('Should return a post', (done) => {
    let body = { body: 'Hello, world!' }
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
    let body = { body: 'Hello, world!' }
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
    let createBody = { body: 'Hello, world!' }
    createPost(createBody, (post) => {
      let putBody = { body: 'Jello, world!' }
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

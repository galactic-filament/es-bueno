'use strict'
const express = require('express')
const Sequelize = require('sequelize')
const HTTPStatus = require('http-status')

const getRouter = (sequelize) => {
  const router = express.Router()

  const Post = sequelize.define('post', {
    body: Sequelize.STRING
  })

  router.post('/posts', (req, res) => {
    Post.create({ body: req.body.body }).then(
      (post) => res.status(HTTPStatus.CREATED).send({ id: post.id })
    ).catch((err) => res.status(HTTPStatus.SERVER_ERROR).send(err.message))
  })
  router.get('/post/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => res.send(post))
  })
  router.delete('/post/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
      Post.destroy({ where: { id: post.id } }).then(() => res.send({}))
    })
  })
  router.put('/post/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
      Post.update(
        { body: req.body.body },
        { where: { id: post.id } }
      ).then(() => {
        Post.findById(post.id).then((post) => res.send(post))
      })
    })
  })

  return router
}


module.exports = getRouter

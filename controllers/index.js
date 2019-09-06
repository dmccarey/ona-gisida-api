const express = require('express')
      , app = express()
      , router = express.Router()
      , layer = require('../models/layer')
      , project = require('../models/project')
      , user = require('../models/user')
      , bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: true,
  keepExtensions: true,
  limit: 100000000,
  defer: true
}))

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, user_id, project_id, Content-Type, Accept")
  next()
})

router.get('/v1/', (req, res) => {
  res.send({ msg: "hello world!" })
})

router.get('/v1/auth', (req, res) => {
  res.send({ msg: "auth" })
})

router.get('/v1/test', (req, res) => {
  res.send({ msg: "Test!" })
})

router.get('/v1/projects', (req, res) => {
  project.all().then(function(data) {
    res.send(data)
  })
})

router.get('/v1/project/add', (req, res) => {
  project.add().then(function(data) {
    res.send(data)
  })
})

router.get('/v1/project/:id', (req, res) => {
  var id = req.params.id
  project.get(id).then(function(data) {
    res.send(data.Item.project)
  })
})

router.post('/v1/edit/project', (req, res) => {
  var item = req.body.Item
  project.edit(item).then(function(data) {
    res.send(data)
  })
})

router.get('/v1/layers', (req, res) => {
  layer.all().then(function(data) {
    res.send(data)
  })
})

router.get('/v1/layer/:id', (req, res) => {
  var id = req.params.id
  layer.get(id).then(function(data) {
    res.send(data)
  })
})

router.get('/v1/view/layer/:id', (req, res) => {
  var id = ''
  id = req.params.id
  var host = req.headers.host
  layer.view(id, host).then(function(data) {
    res.send(data)
  })
})

router.get('/v1/obj/layer/:id', (req, res) => {
  var id = req.params.id
  layer.getLayerObj(id).then(function(data) {
    res.send(data)
  })
})

router.post('/v1/edit/layer', (req, res) => {
  var item = req.body.Item
  layer.edit(item).then(function(data) {
    res.send(data)
  })
})

router.get('/v1/layer/add', (req, res) => {
  var l = layer.add()
  res.send('')
})

module.exports = router

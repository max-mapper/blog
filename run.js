var logging = require('logref')
var stoopid = require('stoopid')
var path = require('path')
var tako = require('tako')
var _ = require('underscore')
var deepExtend = require('deep-extend')
var timeago = require('timeago')
var syncHelpers = require('./sync-helpers')

logging.stdout()
process.logging = logging

var blog = tako({logger: stoopid.logger('tako'), socketio: {logger: stoopid.logger('socketio')}})
blog.templates.directory(path.resolve(__dirname, 'templates'))

function renderPosts(finish) {
  var page = blog.page()
  page.template('index')
  page.promise('index')(false, deepExtend({}, {posts: blog.posts, nav: blog.nav}))
  page.on('finish', finish)
  return page
}

function generateTimestamps(posts) {
  return _.map(posts, function(p) {
    p.timeago = timeago(+new Date(p.published_on))
    return p
  })
}

blog.route('/', function (req, resp) {
  function finish(data) {
    data.index.posts[0].active = "active"
    data.index.posts = generateTimestamps(data.index.posts)
    data.index.selected = data.index.posts[0]
  }
  req.pipe(renderPosts(finish)).pipe(resp)
})
.methods('GET')
;

blog.route('/:id', function (req, resp) {
  function finish(data) {
    _.each(data.index.posts, function(p) {
      if (p.name !== req.route.params['id']) return
      p.active = 'active'
      data.index.selected = p
      data.index.posts = generateTimestamps(data.index.posts)
    })
    _.each(data.index.nav, function(p) {
      if (p.name !== req.route.params['id']) return
      data.index.selected = p
      data.index.posts = []
    })
  }
  req.pipe(renderPosts(finish)).pipe(resp)
})
.methods('GET')
;


blog.route('/*').files(path.resolve(__dirname, 'attachments'))

console.log('fetching blog posts...')
syncHelpers.getPublishedPosts('maxogden', function(err, data) {
  if (err) return console.error(err)
  blog.posts = data.posts
  blog.nav = data.nav
  
  blog.httpServer.listen(80, function () { console.log("running blog on " + 80) })
})

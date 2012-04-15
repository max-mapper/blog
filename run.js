var logging = require('logref')
var stoopid = require('stoopid')
var path = require('path')
var tako = require('tako')
var fs = require('fs')
var _ = require('underscore')
var deepExtend = require('deep-extend')
var timeago = require('timeago')
var jstoxml = require('jstoxml')
var entities = require('entities')
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
    if (data.index.posts.length === 0) return
    data.index.posts[0].active = "active"
    data.index.posts = generateTimestamps(data.index.posts)
    data.index.selected = data.index.posts[0]
  }
  req.pipe(renderPosts(finish)).pipe(resp)
})
.methods('GET')
;

blog.route('/update', function (req, resp) {
  updatePosts(function(err) {
    if (err) return resp.end(err)
    resp.end('updated')
  })
}).methods('POST')

blog.route('/rss', function (req, resp) { resp.end(generateFeed()) })
blog.route('/rss/:keyword', function (req, resp) { resp.end(generateFeed(req.route.params['keyword'])) })


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

blog.posts = []
blog.nav = []

function updatePosts(cb) {
  syncHelpers.getPublishedPosts('maxogden', function(err, data) {
    if (err && cb) return cb(err)
    blog.posts = data.posts
    blog.nav = data.nav
    fs.writeFileSync('./posts.json', JSON.stringify(data))
    if (cb) cb(false)
  })
}

function generateFeed(keyword) {
  var channel = [
    {title: 'Max Ogden Blogotronz'},
    {description: 'Personal blog of the computer nerd named Max Ogden'},
    {link: 'maxogden.com'},
    {lastBuildDate: function() {
      return new Date()
    }},
    {pubDate: function() {
      return new Date()
    }},
    {language: 'en'}
  ]
  
  _.each(blog.posts, function(post) {
    if (keyword && !post.html.match(keyword)) return
    channel.push({
      item: {
        title: post.title,
        link: "http://maxogden.com/" + post.name,
        description: entities.encode(post.html),
        pubDate: function() {
          return new Date(post.published_on)
        }
      }
    })
  })
  
  return jstoxml.toXML({
    _name: 'rss',
    _attrs: {
      version: '2.0'
    },
    _content: {
      channel: channel
    }
  }, {header: true, indent: '  '})
}

var data = JSON.parse(fs.readFileSync('./posts.json'))
blog.posts = data.posts
blog.nav = data.nav

blog.httpServer.listen(8000, function () { console.log("running blog on " + 8000) })
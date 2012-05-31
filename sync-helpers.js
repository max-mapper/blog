var request = require('request').defaults({jar: false})
var async = require('async')
var _ = require('underscore')
var fs = require('fs')

module.exports = {}

// load posts into memory. theyre just simple markdown
module.exports.getPublishedPosts = function(user, callback) {
  request({url: 'http://substance.io/documents/' + user, json: true}, function(err, resp, data) {
    var requests = {}
    _.each(_.keys(data.graph), function(id) {
      if (!data.graph[id].published_on) return
      requests[data.graph[id].name] = function(cb) {
        // need user-agent due to substance.io api bug
        var filename = data.graph[id].name + ".html"
        var fetch = request({
          url: "http://substance.io/" + user + '/' + filename,
          headers: {"user-agent": "curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5"}
        })
        var write = fs.createWriteStream('posts/' + filename)
        write.on('close', function() {
          cb(false, data.graph[id])
        })
        write.on('error', cb)
        fetch.on('error', cb)
        fetch.pipe(write)
      }
    })
    async.parallel(requests, function(err, data) {
      if (err) return callback(err)
      var posts = []
      var nav = []
      _.each(_.keys(data), function(name) {
        if (_.include(['contact', 'projects', 'videos'], name)) nav.push(data[name])
        else posts.push(data[name])
      })
      posts = _.sortBy(posts, function(p) { return p.published_on }).reverse()
      return callback(false, {nav: nav, posts: posts})
    })
  })
}
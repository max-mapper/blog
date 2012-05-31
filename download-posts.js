var fs = require('fs')
var _ = require('underscore')

var syncHelpers = require('./sync-helpers')

syncHelpers.getPublishedPosts('maxogden', function(err, data) {
  if (err) return console.error(err)
  fs.writeFileSync('./posts.json', JSON.stringify(data))
})

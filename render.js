var fs = require('fs')
var path = require('path')
var $ = require('cheerio')
var glob = require('glob')
var moment = require('moment')
var _ = require('underscore')

glob("posts/*.html", function(err, postFilenames) {
  if (err) return console.log(err)
  var documents = loadDocuments()
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.html')
  })
  postNames = _.filter(postNames, function(name) { return documents[name] })
  var sortedPostNames = _.sortBy(postNames, function(name) {
    return documents[name].published
  }).reverse()
  loadPosts(sortedPostNames)
})

function loadDocuments() {
  var documents = {}
  var docs = fs.readFileSync('documents.html').toString()
  var parsedDocs = $.load(docs)
  parsedDocs('.load-document').map(function(i, doc) {
    doc = $(doc)
    var docName = doc.find('.document').attr('id')
    var published = doc.find('.published').attr('data-published')
    documents[docName] = {
      published: published,
      name: docName
    }
  })
  return documents
}

function loadPosts(sortedPostNames) {
  var documents = $.load(fs.readFileSync('documents.html').toString())
  var index = $.load(fs.readFileSync('index.html'))
  var latestPost = false
  sortedPostNames.map(function(postName) {
    var post = fs.readFileSync('posts/' + postName + '.html')
    if (!latestPost) latestPost = post
    switchNav(documents, postName)
    renderPage(index, documents.html(), post, postName + '.html')
  })
  switchNav(documents, sortedPostNames[0])
  renderPage(index, documents.html(), latestPost, 'index.html')
  renderTopNav(index)
}

function switchNav(nav, postName) {
  nav('.active').removeClass('active')
  nav('#' + postName).addClass('active')
}

function renderPage(index, nav, body, outputPath) {
  index('#documents').html(nav)
  index('#document').html(body)
  fs.writeFileSync(outputPath, index.html())
}

function renderTopNav(index) {
  renderPage(index, '', fs.readFileSync('posts/contact.html'), 'contact.html')
  renderPage(index, '', fs.readFileSync('posts/projects.html'), 'projects.html')
  renderPage(index, '', fs.readFileSync('posts/videos.html'), 'videos.html')
}
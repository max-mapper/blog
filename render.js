var fs = require('fs')
var path = require('path')
var $ = require('cheerio')
var glob = require('glob')
var moment = require('moment')
var _ = require('underscore')
var cpr = require('cpr')
var mkdirp = require('mkdirp')
var marked = require('marked')
var RSS = require('rss')
var url = require('url')

var baseURL = 'http://maxogden.com/'
var author = 'Max Ogden'
var outputFolder = 'rendered'

mkdirp.sync(outputFolder)

var documents = loadDocuments()

loadPosts(function(files) {
  files = _.filter(files, function(file) { return documents[file.name] })
  files = _.sortBy(files, function(file) {
    return documents[file.name].published
  }).reverse()
  renderPosts(files)
  createRSS(files)
  copyStatic()
})

function copyStatic() {
  cpr('script', path.join(outputFolder, 'script'), {overwrite: true}, noop)
  cpr('styles', path.join(outputFolder, 'styles'), {overwrite: true}, noop)
  cpr('media', path.join(outputFolder, 'media'), {overwrite: true}, noop)
}

function loadPosts(cb) {
  glob("posts/*.html", function(err, htmlFilenames) {
    if (err) throw err
    glob("posts/*.md", function(err, markdownFilenames) {
      if (err) throw err
      htmlFilenames = htmlFilenames.map(function(name) {
        return path.basename(name, '.html')
      })
      markdownFilenames = markdownFilenames.map(function(name) {
        return path.basename(name, '.md')
      })
      var markdownFiles = markdownFilenames.map(function(mdName) {
        var rendered = new Buffer(marked(fs.readFileSync('posts/' + mdName + '.md').toString()))
        return {name: mdName, content: rendered}
      })
      var htmlFiles = htmlFilenames.map(function(htmlName) {
        return {name: htmlName, content: fs.readFileSync('posts/' + htmlName + '.html')}
      })
      var files = markdownFiles.concat(htmlFiles)
      cb(files)
    })
  })
}

function loadDocuments() {
  var documents = {}
  var docs = fs.readFileSync('documents.html').toString()
  var parsedDocs = $.load(docs)
  parsedDocs('.load-document').map(function(i, doc) {
    doc = $(doc)
    var docName = doc.find('.document').attr('id')
    var published = doc.find('.published').attr('data-published')
    var title = doc.find('.title').html()
    documents[docName] = {
      published: published,
      name: docName,
      title: title
    }
  })
  return documents
}

function renderPosts(files) {
  var documents = $.load(fs.readFileSync('documents.html').toString())
  var index = $.load(fs.readFileSync('index.html'))
  var latest = files[0]
  files.map(function(post) {
    switchNav(documents, post.name)
    renderPage(index, documents.html(), post.content, post.name + '.html')
  })
  switchNav(documents, latest.name)
  renderPage(index, documents.html(), latest.content, 'index.html')
  renderTopNav(index)
}

function switchNav(nav, postName) {
  nav('.active').removeClass('active')
  nav('#' + postName).addClass('active')
}

function renderPage(index, nav, body, outputPath) {
  index('#documents').html(nav)
  index('#document').html(body)
  fs.writeFileSync(path.join(outputFolder, outputPath), index.html())
}

function renderTopNav(index) {
  renderPage(index, '', fs.readFileSync('posts/contact.html'), 'contact.html')
  renderPage(index, '', fs.readFileSync('posts/videos.html'), 'videos.html')
  renderPage(index, '', fs.readFileSync('posts/resume.html'), 'resume.html')
}

function createRSS(files) {
  var contentByName = files.reduce(function(map, file) {
    map[file.name] = makeImagesAbsolute(file.content.toString('utf8'))
    return map
  }, {})

  var feed = new RSS({
    title: author + ' Blog',
    description: 'Open Web Developer',
    feed_url: baseURL + 'rss.xml',
    site_url: baseURL,
    image_url: baseURL + 'icon.png',
    author: author
  })

  var docs = Object.keys(documents).map(function(doc) {
    return documents[doc]
  })

  docs = _.sortBy(docs, function(doc) {
    return doc.published
  }).reverse()

  _.each(documents, function(doc) {
    feed.item({
      title:  doc.title,
      description: contentByName[doc.name],
      url: baseURL + doc.name + '.html',
      date: doc.published
    })
  })

  fs.writeFileSync(outputFolder + '/rss.xml', feed.xml())
}

function makeImagesAbsolute(html) {
  var doc = $.load(html)
  doc('img').each(function(index, img) {
    var relative = $(img).attr('src')
    var absolute = url.resolve(baseURL, relative)
    $(img).attr('src', absolute)
  })
  return doc.html()
}

function noop() {}
// DocumentBrowser
// ---------------

var DocumentBrowser = Backbone.View.extend({
  initialize: function(options) {
    var that = this;
  },
  
  load: function(username, options) {
    if (!options) var options = {};
    var that = this;
    graph.fetch({"type": "/type/document", "creator": "/user/" + username, "subjects|=": ["/attribute/c94d170416f21a768f17a61d8a93b561"]}, function(err, g) {
      if (err) return alert('An error occured during fetching the documents');
      that.render();
      if (options.loadNewest) $('.load-document:first').click();
    });    
  },
  
  render: function() {
    var that = this;
    
    // TODO: use this.options.query here
    that.documents = graph.find({'type': "/type/document", "subjects|=": ["/attribute/c94d170416f21a768f17a61d8a93b561"]});
    
    var DESC_BY_UPDATED_AT = function(item1, item2) {
      var v1 = item1.value.get('updated_at'),
          v2 = item2.value.get('updated_at');
      return v1 === v2 ? 0 : (v1 > v2 ? -1 : 1);
    };
    
    that.documents = that.documents.sort(DESC_BY_UPDATED_AT);
    $(this.el).html(_.tpl('document_browser', {
      documents: that.documents,
      username: "maxogden"
    }));    
  }
});


// Document
// ---------------

var Document = Backbone.View.extend({
  events: {
    'click .toc-item': 'scrollTo'
  },
  
  id: null,
  
  load: function(username, docname, node) {
    var that = this;
    
    // Already loaded?
    if (this.username === username && this.docname == docname) {
      that.scrollTo(node);
    } else {
      function getDocumentId() {
        var document = graph.find({"type": "/type/document", "creator": "/user/"+username, "name": docname}).first();
        return document._id;
      };
      
      graph.fetch({"type": "/type/document", "creator": "/user/"+username, "name": docname, "children": {"_recursive": true}}, function(err, nodes) {
        if (err) return alert('Document could not be found.');
        that.id = getDocumentId();
        if (that.id) {
          that.username = username;
          that.docname = docname;
          that.render();
          // Jump to node?
          that.scrollTo(node);
        }
      });
    }
  },

  scrollTo: function(arg) {
    if (!arg) return;
    var offset = arg.currentTarget ? $('#'+$(arg.currentTarget).attr('node')).offset()
                                   : $('#'+arg).offset();
                                   
    offset ? $('html, body').animate({scrollTop: offset.top}, 'slow') : null;
    if (arg.currentTarget) controller.saveLocation($(arg.currentTarget).attr('href'));
    return false;
  },
  
  initialize: function(options) {
  },
  
  render: function() {
    if (this.id) {
      var doc = graph.get(this.id);
      
      $(this.el).html(_.tpl('document', {
        document: doc,
      }));
      // this.$('#toc').html(new TOCRenderer(doc).render());
      this.$('#document_content').html(new HTMLRenderer(doc).render());
    }
  }
});



// Application
// ---------------


var Application = Backbone.View.extend({
  
  events: {
    'click a.load-document': 'loadDocument',
    'click #browser_toggle': 'showBrowser',
    'click #document_toggle': 'showDocument',
    'click a.select-type': 'selectType'
  },
  
  selectType: function(e) {
    var type = $(e.currentTarget).attr('type');
    this.browser.documentType = type;
    this.browser.render();
    return false;
  },
  
  loadDocument: function(e) {
    app.document.load($(e.currentTarget).attr('user'), $(e.currentTarget).attr('name'));
    controller.saveLocation($(e.currentTarget).attr('href'));
    return false;
  },
  
  showDocument: function() {
    this.toggleView('document');
  },
  
  showBrowser: function() {
    this.toggleView('browser');
  },
  
  initialize: function(options) {
    var that = this;
    
    this.view = 'browser';
    
    that.browser = new DocumentBrowser({
      el: '#browser',
      query: {'type': '/type/document', 'created_at!=': null}
    });
    
    // Init document
    that.document = new Document({
      el: '#document'
    });
    
    makeASweetVoronoiTesselation('#voronoi');
  },
  
  render: function() {
  }
});


// Application Controller
// ---------------

var ApplicationController = Backbone.Controller.extend({
  routes: {
    ':page': 'load',
    ':page/:docname': 'load',
    ':page/:docname/:node': 'load'
  },

  initialize: function() {
    
  },
  
  load: function(page, docname, node) {
    var username = 'maxogden';
    if (!page) var page = "blog";
    if (page === "blog") {
      if (docname) {
        app.browser.load(username);
        app.document.load(username, docname, node);
      } else {
        app.browser.load(username, {loadNewest: true});
      }
    } else {
      $(app.browser.el).html("");
      app.document.load(username, page);
    }
  }
});

var app,
    controller,
    graph = new Data.Graph(schema).connect('ajax', {url: "http://substance.io/graph/"});

$(function() {
  // Start the browser
  app = new Application({el: $('#container')});
  app.render();

  // Register controller
  controller = new ApplicationController({app: app});
  Backbone.history.start();
});

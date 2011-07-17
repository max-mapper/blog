var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =
  { _id:'_design/blog'
  , rewrites :
    [ {from:"/", to:'index.html'}
    , {from:"/api/posts", to:'_list/bulkDocs/posts'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"feed.atom", to:'_list/feed/posts'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {
  /**
   * A simple map function mocking _all, but allows usage with lists etc.
   */
  all: {
    map: function(doc) {
      emit(doc._id, doc);
    }
  },
  posts: {
    map: function(doc) {
      if (doc.date) {
        emit(doc.date, doc);
      }
    }
  },
  nav: {
    map: function(doc) {
      if (doc.date) {
        emit(doc.date, {title: doc.title, date: doc.date});
      }
    }
  },
  comments: {
    map: function(doc) {
      if (doc.type == "comment") {
        emit([doc.topic, doc.at], doc);
      }
    }
  }
};

ddoc.lists = {
  /**
   * A list function that outputs the same format that you use to post into the _bulk_docs API
   *
   * @author Max Ogden
   */
  bulkDocs: function(head, req) {
      var row, out, sep = '\n';

      start({"headers":{"Content-Type" : "application/json"}});

      if ('callback' in req.query) send(req.query['callback'] + "(");

      send('{"docs":[');
      while (row = getRow()) {
          out = JSON.stringify(row.value);
          send(sep + out);
          sep = ',\n';
      }
      send("\n]}");
      if ('callback' in req.query) send(")");
  },
  /**
   * RSS/Atom feed
   */
  feed: function(head, req) {
    var path = require("common/path").init(req);
    var Atom = require("common/atom");
    var Mustache = require("common/mustache");

    var indexPath = path.list('feed','posts',{descending:true, limit:10});
    var feedPath = path.list('feed','posts',{descending:true, limit:10});

    // we load the first row to find the most recent change date
    var row = getRow();

    // generate the feed header
    var feedHeader = Atom.header({
      updated : (row ? new Date(row.value.date) : new Date()),
      title : "Max Ogden dot com",
      feed_id : path.absolute(indexPath),
      feed_link : path.absolute(feedPath),
    });

    // send the header to the client
    send(feedHeader);
    
    // loop over all rows
    if (row) {
      do {
        if (row.value.format == "markdown") {
          var html = markdown.encode(row.value.body);
        } else if (row.value.format == "textile") {
          var html = textile.encode(row.value.body);
        } else {
          var html = Mustache.escape(row.value.post);
        }
        // generate the entry for this row
        var feedEntry = Atom.entry({
          entry_id : path.absolute('/#/'+encodeURIComponent(req.info.db_name)+'/'+encodeURIComponent(row.id)),
          title : row.value.title,
          content : html,
          updated : new Date(row.value.date),
          author : "Max Ogden",
          alternate : path.absolute(path.show('post', row.id))
        });
        // send the entry to client
        send(feedEntry);
      } while (row = getRow());
    }

    // close the loop after all rows are rendered
    return "</feed>";
  }
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("common/validate").init(newDoc, oldDoc, userCtx, secObj);
  v.require(['type']);
  if (v.isAdmin()) return;
  if (newDoc.type == "comment") {
    if (oldDoc) v.unauthorized("You can't edit comments");    
  } else {    
    if (!v.isAdmin()) v.unauthorized("Only admins can change stuff");
  }
}

ddoc.common = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
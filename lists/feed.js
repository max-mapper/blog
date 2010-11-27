function(head, req) {

  var path = require("vendor/couchapp/lib/path").init(req);
  var Atom = require("vendor/couchapp/lib/atom");
  var Mustache = require("vendor/couchapp/lib/mustache");
  
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
function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("vendor/couchapp/lib/validate").init(newDoc, oldDoc, userCtx, secObj);
  v.require(['type']);
  if (newDoc.type == "comment") {
    if (oldDoc) v.unauthorized("You can't edit comments");    
  } else {    
    if (!v.isAdmin()) v.unauthorized("Only admins can change stuff");
  }
}
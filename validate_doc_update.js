function (newDoc, oldDoc, userCtx, secObj) {
  var v = require("vendor/couchapp/lib/validate").init(newDoc, oldDoc, userCtx, secObj);
  if (!v.isAdmin()) v.unauthorized("Only admins can change stuff");
}
function render(data, target) {
  var container = $("#" + target + "s");
  var template = $('#' + target + '-template').text();
  container.append(Mustache.to_html(template, data));
}

$(function() {
  $.couch.db('blog').view("blog/nav", {success: function(data) {
    $.each(data.rows, function(i, data) {
      render($.extend(data.value, {id: data.id}), "blognav-post");
    })
  }})
});

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
var pageTracker = _gat._getTracker("UA-10386944-1");
pageTracker._trackPageview();
} catch(err) {}
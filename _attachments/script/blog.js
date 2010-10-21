$(function() {
  $('#nav').tabs();
  var tabs;
  $.address.init(function(event) {
      tabs = $('#blognav').tabs({
          select: $('#blognav ul:first a').index($('a[rel=address:' + event.value + ']')),
          remote: true
      }).css('display', 'block');
  }).change(function(event) {
      var selection = $('a[rel=address:' + event.value + ']');
      tabs.tabs('select', selection.attr('href'));
      $.address.title($.address.title().split(' | ')[0] + ' | ' + selection.text());
  });
});

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
var pageTracker = _gat._getTracker("UA-10386944-1");
pageTracker._trackPageview();
} catch(err) {}
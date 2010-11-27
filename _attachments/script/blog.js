function render(data, target, callback) {
  if (data.date) data.date = new Date(data.date).toDateString();
  var container = $("#" + target + "s");
  var template = $('#' + target + '-template').text();
  container.append(Mustache.to_html(template, data));
  if (callback) callback.call(this, container);
}

var blog = $.sammy(function() {
  this.get('#/', function() {
    var article = $('.blognav-link:first').attr('href');
    this.redirect(article);
  })

  this.get('#/:nav', function() {
    var nav = $('#' + this.params['nav']);
    nav.siblings().hide();
    nav.show();
  })

  this.get('#/blog/:id', function() {
    $.couch.db('blog').openDoc(this.params['id'], {success: function(data) {
      $('#blogposts').html('');
      render(data, 'blogpost', function(container) {
        $('#blognav').css({'height': container.height()});
        var jsp = $('#blognav').data('jsp');
        if (jsp) {
          jsp.reinitialise();
        } else {
          $('#blognav').jScrollPane();
        }        
      });
    }})
    
  });
});

$(function() {
  $.couch.db('blog').view("blog/nav", {descending: true, success: function(data) {
    $.each(data.rows, function(i, data) {
      render($.extend(data.value, {id: data.id}), "blognav-post");
    })
    blog.run('#/');
  }})
});

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
var pageTracker = _gat._getTracker("UA-10386944-1");
pageTracker._trackPageview();
} catch(err) {}
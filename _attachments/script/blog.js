function render(data, target, callback) {
  if (data.date) data.date = new Date(data.date).toDateString();
  var container = $("#" + target + "s");
  var template = $('#' + target + '-template').text();
  container.append(Mustache.to_html(template, data));
  if (callback) callback.call(this, container);
}

function switchNav(current) {
  var nav = $('#' + current);
  nav.siblings().hide();
  nav.show();
}

var blog = $.sammy(function() {
  this.get('#/', function() {
    this.redirect('#/blog');
  })

  this.get('#/blog', function() {
    switchNav('blog');
    var article = $('.blognav-link:first').attr('href');
    this.redirect(article);
  })
  
  this.get('#/projects', function() {
    switchNav('projects');
  })
  
  this.get('#/contact', function() {
    switchNav('contact');
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
  
  $.ajax({
    url: "http://github.com/api/v2/json/repos/show/maxogden",
    dataType: 'jsonp',
    success: function(data){
      data.repositories.sort(function(a, b) {
         var A = a.pushed_at;
         var B = b.pushed_at;
         return (A > B) ? -1 : (A < B) ? 1 : 0;
      })
      $.each(data.repositories, function(i, repository) {        
        render(repository, "list-project");
      })
    }
  });
  
});

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
var pageTracker = _gat._getTracker("UA-10386944-1");
pageTracker._trackPageview();
} catch(err) {}
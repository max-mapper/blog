$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function prettyDate(time){
	var date = new Date(time.replace(/-/g,"/").replace("T", " ").replace("Z", " +0000").replace(/(\d*\:\d*:\d*)\.\d*/g,"$1")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);

  if (isNaN(day_diff)) return time;

	return day_diff < 1 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "yesterday" ||
		day_diff < 21 && day_diff + " days ago" ||
		day_diff < 45 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
    time;
};


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

function loadComments(post) {
  $('#comments').html('');
  $.couch.db('blog').view("blog/comments", {
    endkey : [post, {}],
    startkey : [post], 
    success: function(data) {
      var comments = {
        topic : post,
        comments : data.rows.map(function(r) {
          var comment = "<p>" + r.value.comment.replace(/\n/g, "</p><p>") + "</p>"
          return {
            gravatar_url : r.value.gravatar_url,
            by : r.value.by,
            at : prettyDate(r.key[1]),
            comment : comment
          }
        })
      }
      render(comments, 'comment');
    }
  })
}

function saveComment(form) {
  var f = form.serializeObject();
  f.type = "comment";
  f.at = new Date();
  
  if (f.gravatar_url) {
    f.gravatar_url = gravatarFor(f.gravatar_url);
  }
  else {
    f.gravatar_url = gravatarFor(Math.random().toString());
  }
  
  $.couch.db('blog').saveDoc(f, {
    success : function() {
      loadComments($('#blogposts').data('id'));
    }
  })
}

function gravatarFor(email) {
  return 'http://www.gravatar.com/avatar/' + hex_md5(email) + '.jpg?s=40&d=identicon';
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
  
  this.get('#/wiki', function() {
    switchNav('wiki');
  })

  this.get('#/blog/:id', function() {
    var id = this.params['id'];
    $.couch.db('blog').openDoc(id, {success: function(data) {
      $('#blogposts').html('');
      $('#comments').html('');
      render(data, 'blogpost', function(container) {
        $('#blognav').css({'height': container.height()});
        var jsp = $('#blognav').data('jsp');
        if (jsp) {
          jsp.reinitialise();
        } else {
          $('#blognav').jScrollPane();
        }
        $('#blogposts').data('id', id);
        loadComments(id);
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
  
  $('#add-comment').live('submit', function(e) {
    e.preventDefault();
    saveComment($(e.target));
  })

  // for voronoi visualization
  var w = 250,
      h = 115;

  var vertices = d3.range(20).map(function(d) {
    return [Math.random() * w, Math.random() * h];
  });

  var svg = d3.select("#voronoi")
    .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "BlYl")
      .on("mousemove", update);

  svg.selectAll("path")
      .data(voronoi(vertices))
    .enter("svg:path")
      .attr("class", function(d, i) { return i ? "q" + (i % 9) + "-9" : null; })
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

  svg.selectAll("circle")
      .data(vertices.slice(1))
    .enter("svg:circle")
      .attr("transform", function(d) { return "translate(" + d + ")"; })
      .attr("r", 2);

  function update() {
    vertices[0] = d3.svg.mouse(this);
    svg.selectAll("path")
        .data(voronoi(vertices)
        .map(function(d) { return "M" + d.join("L") + "Z"; }))
        .filter(function(d) { return this.getAttribute("d") != d; })
        .attr("d", function(d) { return d; });
  }

});

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
try {
var pageTracker = _gat._getTracker("UA-10386944-1");
pageTracker._trackPageview();
} catch(err) {}
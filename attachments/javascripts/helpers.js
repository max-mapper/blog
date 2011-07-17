// Helpers
// ---------------

_.tpl = function(tpl, ctx) {
  source = $("script[name="+tpl+"]").html();
  return _.template(source, ctx);
};


/**
 * Date.parse with progressive enhancement for ISO-8601, version 2
 * © 2010 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function () {
    _.date = function (date) {
        var timestamp = Date.parse(date), minutesOffset = 0, struct;
        if (isNaN(timestamp) && (struct = /^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {
            if (struct[8] !== 'Z') {
                minutesOffset = +struct[10] * 60 + (+struct[11]);

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +struct[7].substr(0, 3));
        }

        return new Date(timestamp).toDateString();
    };
}());


_.teaser = function(str) {
  if (!str) return "";
  return str.length > 90 ? str.trim().substring(0, 89)+" ..." : str;
}

// _.prettyDate = function(time) {
//   return jQuery.timeago(time);
// };


_.stripTags = function(input, allowed) {
// Strips HTML and PHP tags from a string  
// 
// version: 1009.2513
// discuss at: http://phpjs.org/functions/strip_tags
// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   improved by: Luke Godfrey
// +      input by: Pul
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Onno Marsman
// +      input by: Alex
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Marc Palau
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Eric Nagel
// +      input by: Bobby Drake
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Tomasz Wesolowski
// +      input by: Evertjan Garretsen
// +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
// *     example 1: strip_tags('<p>Kevin</p> <b>van</b> <i>Zonneveld</i>', '<i><b>');
// *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
// *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
// *     returns 2: '<p>Kevin van Zonneveld</p>'
// *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
// *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
// *     example 4: strip_tags('1 < 5 5 > 1');
// *     returns 4: '1 < 5 5 > 1'
// *     example 5: strip_tags('1 <br/> 1');
// *     returns 5: '1  1'
// *     example 6: strip_tags('1 <br/> 1', '<br>');
// *     returns 6: '1  1'
// *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
// *     returns 7: '1 <br/> 1'
   allowed = (((allowed || "") + "")
      .toLowerCase()
      .match(/<[a-z][a-z0-9]*>/g) || [])
      .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
   var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
       commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
   return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
   });
}

function makeASweetVoronoiTesselation(selector) {
  var w = 335,
      h = 60;

  var vertices = d3.range(20).map(function(d) {
    return [Math.random() * w, Math.random() * h];
  });

  var svg = d3.select(selector)
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
}
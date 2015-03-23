var margin = {top: 5, right: 10, bottom: 5, left: 10},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    diameter = 450,
    radius = Math.min(width, height) / 2;

var Treemap = (function(){
  var treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });

  var div = d3.select("#treemap")
      .style("position", "relative")
      .style("width", (width + margin.left + margin.right) + "px")
      .style("height", (height + margin.top + margin.bottom) + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

  var node;

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }

  return {
    draw: function(root) {
      node = div.datum(root).selectAll(".node")
          .data(treemap.nodes)
        .enter().append("div")
          .attr("class", "node")
          .call(position)
          .style("background", function(d) { return d.children ? d3.hcl(d.color.h, d.color.c, d.color.l) : null; })
          .text(function(d) { return d.children ? null : d.name; });
    },
    update: function(){
      node.transition().style("background", function(d) { return d.children ? d3.hcl(d.color.h, d.color.c, d.color.l) : null; });
    }
  };
})();

var RadialTree = (function(){
  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 120])
      .separation(function(a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = d3.select("#tree")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  return {
    draw: function(root) {
      var nodes = tree.nodes(root),
          links = tree.links(nodes);

      svg.selectAll(".link")
          .data(links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

      node.append("circle")
          .attr("r", 4.5)
          .attr("fill", function(d){return d3.hcl(d.color.h, d.color.c, d.color.l).rgb();});

      node.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
          .text(function(d) { return d.name; });
    },
    update: function(){
      svg.selectAll('circle').transition().attr("fill", function(d){return d3.hcl(d.color.h, d.color.c, d.color.l).rgb();});
    }
  };
})();

var Sunburst = (function(){
  var svg = d3.select("#sunburst")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function() { return 1; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  var path;

  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  return {
    draw: function(root) {
      path = svg.datum(root).selectAll("path")
          .data(partition.nodes)
        .enter().append("path")
          .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
          .attr("d", arc)
          .style("stroke", "#fff")
          .style("fill", function(d) { return d3.hcl(d.color.h, d.color.c, d.color.l);})
          .each(stash);
    },
    update: function(){
      path.transition().style("fill", function(d) { return d3.hcl(d.color.h, d.color.c, d.color.l);});
    }
  };

})();

function ready(fn) {
  if (document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function(){
  var additive = TreeColors("add"),
      subtractive = TreeColors("sub"),
      mode = additive;

  d3.json("data.json", function(error, root) {
    additive(root);

    Treemap.draw(root);
    RadialTree.draw(root);
    Sunburst.draw(root);

    d3.selectAll("input").on("change", function(){
      mode = mode === additive ? subtractive : additive;

      mode(root);

      Treemap.update();
      RadialTree.update();
      Sunburst.update();
    });
  });
});

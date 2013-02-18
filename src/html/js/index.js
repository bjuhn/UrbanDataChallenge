window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf.json")
    .defer(d3.json, "../../sub/udc/public-transportation/san-francisco/geo/topojson/routes.json")
    .await(ready);
}


function ready(error, test_point, sf, sf_routes) {
  
  var proj = d3.geo
    .mercator()
    .center([ "-122.499774", "37.79379" ])
    .scale(1 << 21);
  
  var path = d3.geo.path()
    .projection(proj);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

  svg.append('svg:defs')
    .append('svg:pattern')
    .attr('id', 'tile-ww')
    .attr('patternUnits','userSpaceOnUse')
    .attr('width', 1600)
    .attr('height', 982)
    .append('svg:image')
    .attr('xlink:href', 'images/ocean3.png')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1600)
    .attr('height', 982);

  svg.append("path")
    .datum({type : "FeatureCollection", features : sf.features})
    .attr("d", path)
    .style("fill", 'url(#tile-ww)');

  svg.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data(topojson.object(sf_routes, sf_routes.objects.routes).geometries)
    .enter()
    .append("path")
    .attr("stroke", function(d) {return "hsl(" + Math.random() * 360 + ",100%,50%)";})
    .attr("d", path);

   for(var route in test_point) {
     svg.append("path")
       .datum({type: "FeatureCollection", features: test_point[route].features})
       .attr("d", path)
       .style("fill", function(d) {return "hsl(" + Math.random() * 360 + ",100%,50%)";})
   }
}
window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf.json")
    .defer(d3.json, "../../sub/udc/public-transportation/san-francisco/geo/topojson/routes.json")
    .await(ready);
}


function ready(error, test_point, sf, sf_routes) {
  road_width = 8;
  var proj = d3.geo
    .mercator()
    .center([ "-122.499774", "37.79379" ])
    .scale(1 << 21);
  
  path = d3.geo.path()
    .projection(proj);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", 350)
    .attr("height", 350);

  gElm = svg.append("g");

  addPattern(svg, 'tile-water', 'images/ocean3.png', 1600, 982);
  addPattern(svg, 'tile-asphalt', 'images/asphalt.jpg', 320, 320);

  gElm.append("path")
    .datum({type : "FeatureCollection", features : sf.features})
    .attr("d", path)
    .style("fill", 'url(#tile-water)');

  var route10 = topojson.object(sf_routes, sf_routes.objects.routes).geometries[2];
  var r1 = makeRoute(gElm, path, route10);

  var len = r1.node().getTotalLength();
  var offset = 0;

  zoomTo(route10, gElm, path, svg);

  // var bus = svg.append("g").append("circle")
  // .attr({
  //   r: 10,
  //   transform: function() {
  //     var p = r1.node().getPointAtLength(len - offset)
  //     return "translate(" + [p.x, p.y] + ")";
  //   }
  // })
  // .style("fill", "red");

  // var dur = 20000;
  // bus.transition()
  //   .duration(dur)
  //           .ease("bounce")
  //   .attrTween("transform", function(d,i) {
  //     return function(t) {
  //       var p = r1.node().getPointAtLength(len * t)
  //       return "translate(" + [p.x, p.y] + ")";
  //     }
  //   })
}


function zoomTo(feature, gElm, path, svg) {

  var bbox = path.bounds(feature);
  var elmWidth = svg.attr('width');
  var elmHeight = svg.attr('height');

// scale : take element width  / feature width
// translate: half between x0-x1 + x0, half between y

  var bWidth = Math.abs(bbox[1][0] - bbox[0][0]);
  var bHeight = Math.abs(bbox[0][1] - bbox[1][1]);

  var zoomScaleXFactor = (elmWidth / bWidth) * 0.8;
  var zoomScaleYFactor = (elmHeight / bHeight) * 0.8;
  var zoomScaleFactor = (zoomScaleXFactor > zoomScaleYFactor) ? zoomScaleYFactor : zoomScaleXFactor;
  (zoomScaleXFactor > zoomScaleYFactor) ? alert('a') : alert('b');

  var zoomX = bbox[0][0] + (bWidth / 2);
  var zoomY = bbox[0][1] + (bHeight / 2)

  var scale = "scale(" + zoomScaleFactor + ")";
  // var transform = "translate(" + ((elmWidth/2-zoomX) - ((elmWidth)*zoomScaleFactor)/8) + "," + ((elmHeight/2 - zoomY) - ((elmHeight/2)*zoomScaleFactor)/4) + ")";
  var transform = "translate(" + (elmWidth-zoomX) + "," + (elmHeight - zoomY)+ ")";
   gElm.attr("transform", scale + transform);

   // gElm.attr("transform", "scale(1.5)");
   putDot(zoomX, zoomY, gElm);
}

function putDot(x, y, gElm) {
   var bus = gElm.append("circle")
  .attr({
    r: 20,
    transform: "translate(" + [x, y] + ")"
  })
  .style("fill", "red");

}

function makeRoute(svg, path, feature) {
  svg.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data([feature])
    .enter()
    .append("path")
    .style("stroke", 'url(#tile-asphalt)')
    .style("stroke-width", road_width)
    .attr("d", path);

  var route = svg.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data([feature])
    .enter()
    .append("path")
    .style("stroke", "#b2b219")
    .style("stroke-dasharray" , road_width+","+road_width)
    .style("stroke-width", "2")
    .attr("d", path);
    return route;
}



function getPoint(y,x) {
  return {"type": "Point", "coordinates": [y, x]};
}

function addPattern(svg, name, img, iwidth, iheight, dwidth, dheight) {
  dwidth = dwidth | iwidth;
  dheight = dheight | iheight;
  svg.append('svg:defs')
    .append('svg:pattern')
    .attr('id', name)
    .attr('patternUnits','userSpaceOnUse')
    .attr('width', dwidth)
    .attr('height', dheight)
    .append('svg:image')
    .attr('xlink:href', img)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', iwidth)
    .attr('height', iheight);  
}


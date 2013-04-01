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
  var path = d3.geo.path()
    .projection(proj);
  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1350)
    .attr("height", 1500);
  gElm = svg.append("g");
  gElm.append("path")
    .datum({type : "FeatureCollection", features : sf.features})
    .attr("d", path)
    .style("fill", 'url(#tile-water)');
  // 
  var route10 = topojson.object(sf_routes, sf_routes.objects.routes).geometries[2];
  zoomTo2(sf.features[0], 1000, null, gElm, path, svg);
  addImage(gElm, proj);
  // zoomTo(sf.features[0], gElm, path, svg);
  // zoomToBounds([[-122.515, 37.816], [-122.378, 37.707]], gElm, path, svg);
}

function addImage(gElm, proj) {
 var coords = proj([-122.515, 37.816]);
 var coords2 = proj([-122.378, 37.707]);
 var w = Math.abs(coords[0] - coords2[0]);
 var h = Math.abs(coords[1] - coords2[1]);
 gElm.append("svg:image")
      .attr("xlink:href", "../html/images/M-SF-50000-01.jpg")
      .attr("x", coords[0])
      .attr("y", coords[1])
      .attr("width", w)
      .attr("height", h);
}



function zoomTo(feature, gElm, path, svg) {

  var bbox = path.bounds(feature);
  alert(bbox);
  var elmWidth = svg.attr('width');
  var elmHeight = svg.attr('height');

// scale : take element width  / feature width
// translate: half between x0-x1 + x0, half between y

  var bWidth = Math.abs(bbox[1][0] - bbox[0][0]);
  var bHeight = Math.abs(bbox[0][1] - bbox[1][1]);

  var zoomScaleXFactor = (elmWidth / bWidth);
  var zoomScaleYFactor = (elmHeight / bHeight);
  var zoomScaleFactor = (zoomScaleXFactor > zoomScaleYFactor) ? zoomScaleYFactor : zoomScaleXFactor;

  var zoomX = bbox[0][0] + (bWidth / 2);
  var zoomY = bbox[0][1] + (bHeight / 2)

  var scale = "scale(" + zoomScaleFactor + ")";
  // var transform = "translate(" + ((elmWidth/2-zoomX) - ((elmWidth)*zoomScaleFactor)/8) + "," + ((elmHeight/2 - zoomY) - ((elmHeight/2)*zoomScaleFactor)/4) + ")";
  var transform = "translate(" + (elmWidth-zoomX) + "," + (elmHeight - zoomY)+ ")";
   gElm.attr("transform", scale + transform);

   // gElm.attr("transform", "scale(1.5)");
   putDot(zoomX, zoomY, gElm);
}

function zoomToBounds(bounds, gElm, path, svg) {

  bbox = [];
  bbox[0] = proj(bounds[0]);
  bbox[1] = proj(bounds[1]);

  var elmWidth = svg.attr('width');
  var elmHeight = svg.attr('height');

// scale : take element width  / feature width
// translate: half between x0-x1 + x0, half between y

  var bWidth = Math.abs(bbox[1][0] - bbox[0][0]);
  var bHeight = Math.abs(bbox[0][1] - bbox[1][1]);

  var zoomScaleXFactor = (elmWidth / bWidth) * 0.8;
  var zoomScaleYFactor = (elmHeight / bHeight) * 0.8;
  var zoomScaleFactor = (zoomScaleXFactor > zoomScaleYFactor) ? zoomScaleYFactor : zoomScaleXFactor;

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

function zoomTo2(feature, duration, percentPad, gElm, path, svg) {
  var duration = duration || 0;
  var percentPad = percentPad || 1;
  var bbox = path.bounds(feature);
  var elmWidth = parseInt(svg.style('width'));
  var elmHeight = parseInt(svg.style('height'));

  var bWidth = Math.abs(bbox[1][0] - bbox[0][0]);
  var bHeight = Math.abs(bbox[0][1] - bbox[1][1]);

  var zoomScaleXFactor = (elmWidth / bWidth) * percentPad;
  var zoomScaleYFactor = (elmHeight / bHeight) * percentPad;
  var zoomScaleFactor = (zoomScaleXFactor > zoomScaleYFactor) ? zoomScaleYFactor : zoomScaleXFactor;

  var bboxCenterX = bbox[0][0] + (bWidth / 2);
  var bboxCenterY = bbox[0][1] + (bHeight / 2)
  var xZoomOffset = elmWidth/2/zoomScaleFactor - bboxCenterX;
  var yZoomOffset = elmHeight/2/zoomScaleFactor - bboxCenterY;
  
  var scale = "scale(" + zoomScaleFactor + ") ";
  var transform = "translate(" + xZoomOffset + "," + yZoomOffset + ")";
  

  gElm.transition()
    .duration(duration)
    .attr("transform", scale + transform);
}


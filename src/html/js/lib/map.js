Map = function(container, proj) {
  this.container = container;
  this.proj = proj
  this.road_width = 8;

  this.width = parseInt(this.container.style('width')-2, 10);
  this.height = parseInt(this.container.style('height')-2, 10)

  this.path = d3.geo.path()
    .projection(this.proj);

  this.svg = this.container
    .append("svg")
    .style("width", this.width)
    .style("height", this.height)
    .classed("map", true);

  this.g = this.svg.append("g")
    .style("width", this.width)
    .style("height", this.height)
    .style("fill", 'url(#tile-water)');
  this.addPattern('tile-water', 'images/ocean3.png', 1600, 982);
}


Map.prototype.addFeatures = function(features, styleClass) {
  this.g.append("path")
    .datum({type : "FeatureCollection", features : features})
    .attr("d", this.path)
    .classed(styleClass, true)
}

Map.prototype.addPoint = function(lat, lng, size, styleClass) {
  var coords = this.proj([lng, lat]);
  this.g
    .append("circle")
    .classed(styleClass, true)
    .attr({
    r: size,
    cx: coords[0],
    cy: coords[1] });
}

Map.prototype.zoomToFeature = function(feature, duration, percentPad, callback) {
  this.zoomToInt(this.path.bounds(feature), duration, percentPad, callback);

}

Map.prototype.zoomToBounds = function(bounds, duration, percentPad, callback) {
  this.zoomToInt([this.proj(bounds[0]), this.proj(bounds[1])], duration, percentPad, callback);
}

Map.prototype.zoomToInt = function(bbox, duration, percentPad, callback) {
  var duration = duration || 0;
  var percentPad = percentPad || 1;

  var elmWidth = parseInt(this.svg.style('width'), 10);
  var elmHeight = parseInt(this.svg.style('height'), 10);

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

  this.g.transition()
    .duration(duration)
    .attr("transform", scale + transform)
    .each("end", callback);
}

Map.prototype.bind = function(action, func) {
  this.svg.on(action, func);  
}

Map.prototype.addImage = function(img, bounds) {
 var nw = this.proj(bounds[0]);
 var se = this.proj(bounds[1]);
 var w = Math.abs(nw[0] - se[0]);
 var h = Math.abs(nw[1] - se[1]);
 return this.g.append("svg:image")
      .attr("xlink:href", img)
      .attr("x", nw[0])
      .attr("y", nw[1])
      .attr("width", w)
      .attr("height", h);

}

Map.prototype.getGElm = function() {
  return this.g;
}

Map.prototype.getPath = function() {
  return this.path;
}

Map.prototype.addPattern = function(name, img, iwidth, iheight, dwidth, dheight) {
  dwidth = dwidth | iwidth;
  dheight = dheight | iheight;
  this.svg.append('svg:defs')
    .append('svg:pattern')
    .attr('id', name)
    .attr('patternUnits','objectBoundingBox')
    .attr('width', dwidth)
    .attr('height', dheight)
    .append('svg:image')
    .attr('xlink:href', img)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', iwidth)
    .attr('height', iheight);  
}

function putDot(x, y, gElm, msg) {
   var bus = gElm.append("circle")
  .attr({
    r: 10,
    transform: "translate(" + [x, y] + ")"
  })
  .on("click", function() {alert(msg);})
  .style("fill", "red");

}
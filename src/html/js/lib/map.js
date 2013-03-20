Map = function(container, proj) {
  this.container = container;
  this.proj = proj
  this.road_width = 8;

  this.width = parseInt(this.container.style('width'));
  this.height = parseInt(this.container.style('height'))

  this.path = d3.geo.path()
    .projection(this.proj);

  this.svg = this.container
    .append("svg")
    .style("width", this.width)
    .style("height", this.height);
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

Map.prototype.zoomTo = function(feature, duration, percentPad, callback) {
  var duration = duration || 0;
  var percentPad = percentPad || .8;
  var bbox = this.path.bounds(feature);
  var elmWidth = parseInt(this.svg.style('width'));
  var elmHeight = parseInt(this.svg.style('height'));

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

Map.prototype.addImage = function() {
  // var coords = this.proj([-102.456875,37.798255]);
  // alert(coords[0] + " : " + coords[1])
  // this.svg.append("svg:image")
  //     .attr("xlink:href", "http://www.e-pint.com/epint.jpg")
  //     .attr("x", coords[0])
  //     .attr("y", coords[1])
  //     .attr("width", 150)
  //     .attr("height", 200);
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

function putDot(x, y, gElm, msg) {
   var bus = gElm.append("circle")
  .attr({
    r: 10,
    transform: "translate(" + [x, y] + ")"
  })
  .on("click", function() {alert(msg);})
  .style("fill", "red");

}
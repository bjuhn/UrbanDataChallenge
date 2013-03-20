Route = function(routeData, segmentData, gElm, path) {
  this.routeData = routeData;
  this.segmentData = segmentData;
  this.gElm = gElm;
  this.path = path;

  this.offset = 0;
  this.roadWidth = .001;
}

Route.prototype.makeRoute = function() {
  this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data(this.segmentData.features)
    .enter()
    .append("path")
    .style("stroke", 'url(#tile-asphalt)')
    .style("stroke-width", this.roadWidth)
    .attr("d", this.path);

  this.route = this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data(this.segmentData.features)
    .enter()
    .append("path")
    .style("stroke", "#b2b219")
    .style("stroke-dasharray" , this.roadWidth+","+this.roadWidth)
    .style("stroke-width", this.roadWidth/4)
    .attr("d", this.path);

}

Route.prototype.getSegment = function(idx) { 
  return this.route[0][idx];
}
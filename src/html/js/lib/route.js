Route = function(routeData, segmentData, gElm, path) {
  this.routeData = routeData;
  this.segmentData = segmentData;
  this.gElm = gElm;
  this.path = path;

  this.avgSpeed = 0;
  this.speedSets = 0;
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

Route.prototype.updateAvgSpeed = function(speed) { 
  var newSets = this.speedSets + 1;
  this.avgSpeed = (this.avgSpeed * this.speedSets / newSets) + (speed * 1 / newSets);
  this.speedSets++;
}

Route.prototype.getSegment = function(idx) { 
  return this.route[0][idx];
}

Route.prototype.getSegmentData = function(idx) { 
  return this.segmentData["features"][idx];
}


Route.prototype.getAvgSpeed = function(idx) { 
  return this.avgSpeed.toFixed(2);
}
testBus = { "type": "Feature", "properties": { "LINEABBR": "001", "LINENAME": "1 CALIFORNIA", "LINEID": 7928, "SDE_ID": 7928.0, "INSERT_TIM": "2013\/01\/24", "SIGNUPID": 81.0 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -122.39659, 37.79458 ], [ -122.39781, 37.794428 ], [ -122.398975, 37.794277 ], [ -122.40016, 37.794126 ], [ -122.40131, 37.793984 ], [ -122.40216, 37.793877 ] ] ] } }
Route = function(routeGeom, gElm, path) {
  abc = routeGeom;
  this.routeGeom = routeGeom;
  this.gElm = gElm;
  this.path = path;
  this.offset = 0;
  this.roadWidth = .001;

   // this.makeRoute();
   // this.makeBus();
   // this.startAnimateBus();
}

Route.prototype.makeBus = function() {
  this.bus = this.gElm.append("g").append("circle")
    .attr('r', .001)
    .attr('tr1aaaaaaaansform', bind(this, this.animateBus))
    .style("fill", "red");
}

Route.prototype.makeTestBus = function() {
  this.testBus = this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data([testBus])
    .enter()
    .append("path")
    .style("stroke", "blue")
    .style("stroke-width", this.roadWidth)
    .attr("d", this.path);
}

Route.prototype.makeLine = function() {
  this.bus2 = this.gElm.append("g").append("line")
    .attr('r', .001)
    .attr('transform', bind(this, this.animateBus))
    .style("fill", "red");  
}

Route.prototype.startAnimateBus = function() {
  this.makeBus();
  var self = this;
  var dur = 10000;
  this.bus.transition()
    .duration(dur)

    .attrTween("transform", function(d,i) {
      return function(t) {
        var p = self.route.node().getPointAtLength(self.len * t)
        return "translate(" + [p.x, p.y] + ")";
      }
    })
}

Route.prototype.startAnimateTestBus = function() {
  this.makeTestBus();
  var self = this;
  var dur = 20000;
  this.testBus.transition()
    .duration(dur)
    
    .attrTween("transform", function(d,i) {
      return function(t) {
        var p = self.route.node().getPointAtLength(self.len * t)
        document.title = "translate(" + [p.x, p.y] + ")";
       return "translate(" + [p.x, p.y] + ")";
      }
    })
}

Route.prototype.getGeom = function() {
  return this.routeGeom;
}

Route.prototype.animateBus = function() {
  var p = this.route.node().getPointAtLength(this.len - this.offset)
  return "translate(" + [p.x, p.y] + ")";
}


Route.prototype.makeRoute = function() {
  this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data([this.routeGeom])
    .enter()
    .append("path")
    .style("stroke", 'url(#tile-asphalt)')
    .style("stroke-width", this.roadWidth)
    .attr("d", this.path);

  this.route = this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data([this.routeGeom])
    .enter()
    .append("path")
    .style("stroke", "#b2b219")
    .style("stroke-dasharray" , this.roadWidth+","+this.roadWidth)
    .style("stroke-width", this.roadWidth/4)
    .attr("d", this.path);

    this.len = this.route.node().getTotalLength();
}

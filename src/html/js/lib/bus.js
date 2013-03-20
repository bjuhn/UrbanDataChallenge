Bus = function(busData, gElm, route, timeEventRegistry) {
  this.busData = busData;
  this.gElm = gElm;
  this.route = route;
  this.timeEventRegistry = timeEventRegistry;
  this.registerTimeEvents();
}

Bus.prototype.addBus = function() {
  this.busElm = this.gElm
    .append("circle")
    .attr('r', .001)
    .classed("bus", true);
}

Bus.prototype.registerTimeEvents = function() {
  var runs = this.busData.runs;
  for(var i=0;i<runs.length; i++) {
    var run = runs[i];
    this.timeEventRegistry.register(run["depart_time"], bind(this, this.moveBus, run),run["arrive_time"]);
  }
}

Bus.prototype.moveBus = function(run) {
  if(typeof this.busElm == "undefined") {
    this.addBus();
  }

  var self = this;
  var segment = self.route.getSegment(run["segment"]);
  var len = segment.getTotalLength();
  var duration = (new Date(run["arrive_time"]) - new Date(run["depart_time"])) / this.timeEventRegistry.getMultiplier();

  this.busElm.transition()
    .duration(duration)
    .attrTween("transform", function(d,i) {
      return function(t) {
        if(typeof run["backwards"] != "undefined") {
          t = 1-t;
        }
        var p = segment.getPointAtLength(len * t);
        return "translate(" + [p.x, p.y] + ")";
      }
    });
}

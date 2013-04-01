Bus = function(busData, gElm, route, timeEventRegistry) {
  this.busData = busData;
  this.gElm = gElm;
  this.route = route;
  this.timeEventRegistry = timeEventRegistry;
}

Bus.prototype.clear = function() {
  if(this.busElm) this.busElm.remove();
  this.busElm = null;
  this.busData = null;
}

Bus.prototype.addBus = function() {
  this.busElm = this.gElm
    .append("circle")
    .attr('r', .001)
    .classed("bus", true);
}

Bus.prototype.registerTimeEvents = function() {
  var runs = this.busData.runs;
  var format = d3.time.format('%Y-%m-%d %H:%M:%S')
  for(var i=0;i<runs.length; i++) {
    var run = runs[i];
    if (run["arrive_time"] == null || run["depart_time"] == null) {
      continue;
    }
    var departTime = format.parse(run["depart_time"]);
    var arriveTime = format.parse(run["arrive_time"]);
    this.timeEventRegistry.register(departTime, bind(this, this.moveBus, run, departTime, arriveTime), arriveTime);
  }
}

Bus.prototype.moveBus = function(run, departTime, arriveTime) {
  if(run["segment"] == null) {
    return;
  }
  if(typeof this.busElm == "undefined") {
    this.addBus();
  }

  var self = this;
  var segment = self.route.getSegment(run["segment"]);
  var len = self.route.getSegmentLength(run["segment"]);
  var segmentData = self.route.getSegmentData(run["segment"]);

  var timeDiff = arriveTime - departTime;
  var duration = (timeDiff) / this.timeEventRegistry.getMultiplier();
  var speed = 60 / (timeDiff/1000/60) * segmentData["distance"]/1000;

  if (!isNaN(speed) && speed < 100) {
    this.route.updateAvgSpeed(speed);  
  }

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

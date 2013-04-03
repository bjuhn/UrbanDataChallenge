Route = function(gElm, path, timeEventRegistry, proj) {
  this.gElm = gElm;
  this.path = path;
  this.timeEventRegistry = timeEventRegistry;
  this.proj = proj;

  this.reset();
  this.offset = 0;
  this.roadWidth = .0005;
  this.events = new EventRegistry();
}

Route.prototype.setRoute = function(routeData, busData, segmentData, stopData) {
  this.clear();
  this.routeData = routeData;
  this.busData = busData;
  this.segmentData = segmentData;
  this.stopData = stopData;
  this.makeRoute();

  this.buses = [];
  for(var j=0;j<busData.length;j++) {
    // TODO: shouldn't be passing instance of this, should be binding events.
    this.buses.push(new Bus(busData[j], this.gElm, this, this.timeEventRegistry));
  }

  this.stops = [];
  for(var j=0;j<stopData.length;j++) {
    this.stops.push(new Stop(stopData[j], this.gElm, this.proj, this.timeEventRegistry, this));
  }

}

Route.prototype.registerTimeEvents = function() {
  for(var i=0;i<this.buses.length;i++) {
    this.buses[i].registerTimeEvents();
  }
  for(var i=0;i<this.stops.length;i++) {
    this.stops[i].registerTimeEvents();
  }
}

Route.prototype.reset = function() {
  this.routeData = null;
  this.busData = null;
  this.segmentData = null;
  this.stopData = null;
  this.route = null;
  this.avgSpeed = 0;
  this.avgWait = 0;
  this.maxPassengers = 0;
  this.passengerCount = 0;
  this.speedSets = 0;
  this.waitSets = 0;
  this.buses = null;
  this.stops = null;
}

Route.prototype.clear = function() {
  if(this.buses != null) {
    for(var j=0;j<this.buses.length;j++) {
        this.buses[j].clear();
    }    
  }
  if(this.stops != null) {
    for(var j=0;j<this.stops.length;j++) {
      this.stops[j].clear();    
    }
  }
  if (this.route) this.route.remove();
  this.reset();
}

Route.prototype.makeRoute = function() {
  this.route = this.gElm.append("g")
    .attr("class", "routes")
    .selectAll("path")
    .data(this.segmentData.features)
    .enter()
    .append("path")
    .attr("d", this.path);
}

Route.prototype.bind = function(eventName, func) {
  this.events.bind(eventName, func);
}

Route.prototype.updateAvgSpeed = function(speed) { 
  var newSets = this.speedSets + 1;
  this.avgSpeed = (this.avgSpeed * this.speedSets / newSets) + (speed * 1 / newSets);
  this.speedSets++;
  this.updateRank();
  this.events.fire("changeAvgSpeed", Math.round(this.avgSpeed));
}

Route.prototype.getSegment = function(idx) { 
  return this.route[0][idx];
}

Route.prototype.getSegmentData = function(idx) { 
  return this.segmentData["features"][idx];
}

Route.prototype.updatePassengerCount = function(count) { 
  this.passengerCount = this.passengerCount + count;
  this.events.fire("changePassengers", this.passengerCount);
}

Route.prototype.updateRank = function() {
  var newRank = (this.avgSpeed/60* 50) + (this.passengerCount/this.maxPassengers * 50) - (this.avgWait/60 * 50);
  newRank = Math.round(newRank);
  if(newRank < 0) {
    newRank = 0;
  }
  this.events.fire("changeRank", newRank);
}

Route.prototype.updateWaitTime = function(avgTime) { 
  var newSets = this.waitSets + 1;
  this.avgWait = (this.avgWait * this.waitSets / newSets) + (avgTime * 1 / newSets);
  this.waitSets++;
  this.events.fire("changeWaitTime", Math.round(this.avgWait));
}

Route.prototype.getSegmentLength = function(idx) {
  var segment = this.getSegment(idx);
  if(segment && typeof segment.totalLength == 'undefined') {
    segment.totalLength = this.getSegment(idx).getTotalLength();  
  }
  return segment.totalLength;
}

Route.prototype.getMaxPassengers = function() {
  return this.maxPassengers;
}

Route.prototype.setMaxPassengers = function(max) {
  this.maxPassengers = max;
}

Route.prototype.updateMaxPassengerCount = function(cnt) {
  this.maxPassengers = this.maxPassengers + cnt;
}

Route.prototype.isSet = function () {
  return (this.route) ? true: false;
}
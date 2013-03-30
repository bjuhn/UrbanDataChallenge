Stop = function (stopData, gElm, proj, timeEventRegistry, route) {
  this.stopData = stopData;
  this.gElm = gElm;
  this.proj = proj;
  this.route = route;
  this.timeEventRegistry = timeEventRegistry;
  this.coords = this.proj([this.stopData.geometry.coordinates[0], this.stopData.geometry.coordinates[1]]);
  this.maxLoad = 4;
  this.size = .0012;
  this.makeStop();
}

Stop.prototype.registerTimeEvents = function() {
  var loads = this.stopData.passengerLoads;
  if (loads == null) {
    return;
  }
  this.sortPickupTimes();

  var lastTime = (new Date(loads[0]["pickup_time"])).getTime() - (1000 * 2)
  for(var i=0;i<loads.length; i++) {
    var load = loads[i];
    this.timeEventRegistry
      .register(lastTime, 
                bind(this, this.startWaiting, parseInt(load["count"]), new Date(lastTime), new Date(load["pickup_time"])),
                load["pickup_time"]);
    this.timeEventRegistry
      .register(load["pickup_time"], bind(this.route, this.route.updatePassengerCount, parseInt(load["count"])), load["pickup_time"]);
    lastTime = load["pickup_time"];
  }
}

Stop.prototype.sortPickupTimes = function() {
  this.stopData.passengerLoads.sort(function(eventA, eventB) {
    x = new Date(eventA["pickup_time"]).getTime();
    y = new Date(eventB["pickup_time"]).getTime();
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
  });
}

Stop.prototype.clear = function() {
  this.stopElm.remove();
  this.startTime = null;
}

Stop.prototype.makeStop = function() {
  this.stopElm = this.gElm.append("circle")
    .classed("stop", true)
    .attr({
      r: this.size,
      cx: this.coords[0],
      cy: this.coords[1]
    });
}

Stop.prototype.start = function() {
  this.startTime = timeEventRegistry.getStartDate();
}

Stop.prototype.startWaiting = function(count, startTime, pickupTime) {
  var duration = (pickupTime.getTime() - startTime.getTime()) / timeEventRegistry.getMultiplier();
  var size = this.size + (this.size * (count/this.maxLoad));
  var self = this;
  
  this.stopElm.attr("r", this.size)
    .transition()
    .duration(duration)
    .attr("r", size)
    .each("end", function() {
      self.stopElm
        .transition()
        .duration(100)
        .attr("r", self.size)
    });
}
Stop = function (stopData, gElm, proj, timeEventRegistry) {
  this.stopData = stopData;
  this.gElm = gElm;
  this.proj = proj;
  this.timeEventRegistry = timeEventRegistry;
  this.coords = this.proj([this.stopData.geometry.coordinates[0], this.stopData.geometry.coordinates[1]]);
  this.maxLoad = 14;
  this.size = .0012;
  this.makeStop();
  this.registerTimeEvents();
}

Stop.prototype.registerTimeEvents = function() {
  var loads = this.stopData.passengerLoads;
  var lastTime = (new Date(loads[0]["pickup_time"])).getTime() - (1000 * 60 * 2)
  for(var i=0;i<loads.length; i++) {
    var load = loads[i];
    this.timeEventRegistry
      .register(lastTime, 
                bind(this, this.startWaiting, load["count"], new Date(lastTime), new Date(load["pickup_time"])),
                load["pickup_time"]);
    lastTime = load["pickup_time"];
  }
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
  // alert(startTime);
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
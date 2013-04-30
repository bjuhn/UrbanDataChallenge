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

  this.circleScale = d3.scale.linear().domain([0, 40]).range([.0012, .0042]).clamp(true);

}

Stop.prototype.registerTimeEvents = function() {
  var loads = this.stopData.passengerLoads;
  if (loads == null) {
    return;
  }
  var format = d3.time.format('%Y-%m-%d %H:%M:%S')
  // this.sortPickupTimes();

  var lastTime = null;
  if(loads[0]["pickup_time"]) {
    lastTime = new Date(format.parse(loads[0]["pickup_time"]).getTime() - (1000 * 2));
  } 

  for(var i=0;i<loads.length; i++) {
    var load = loads[i];
    if (load["pickup_time"] == null) {
      continue;
    }
    if(lastTime == null) {
      lastTime = load["pickup_time"];
      continue;
    }

    var pickupTime = format.parse(load["pickup_time"]);
    var passengerCount = parseInt(load["count"], 10);
    if(isNaN(passengerCount)) {
      passengerCount = 0;
    }
    this.timeEventRegistry
      .register(lastTime, 
                bind(this, this.startWaiting, passengerCount, lastTime, pickupTime),
                pickupTime);
    if(i>0) {
      var used = this.timeEventRegistry
        .register(pickupTime, bind(this.route, this.route.updatePassengerCount, passengerCount), pickupTime);
      if(used) {
        this.route.updateMaxPassengerCount(passengerCount);
      }

      var avgWaitTime = passengerCount * (pickupTime.getTime() - lastTime.getTime()) / 1000 / 60 / 2;
      if(!isNaN(avgWaitTime)){
        this.timeEventRegistry
          .register(pickupTime, bind(this.route, this.route.updateWaitTime, avgWaitTime), pickupTime);          
      }
    }
    lastTime = pickupTime;
  }
}

/* todo: move this to ruby */
// Stop.prototype.sortPickupTimes = function() {
//   this.stopData.passengerLoads.sort(function(eventA, eventB) {
//     x = new Date(eventA["pickup_time"]).getTime();
//     y = new Date(eventB["pickup_time"]).getTime();
//     return ((x < y) ? -1 : ((x > y) ?  1 : 0));
//   });
// }

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
  var self = this;
  this.stopElm.attr("r", this.size)
    .transition()
    .duration(duration)
    .attr("r", self.circleScale(count))
    .each("end", function() {
      self.stopElm
        .transition()
        .duration(100)
        .attr("r", self.size)
    });
}
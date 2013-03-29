TimeEventRegistry = function(clockElm) {
  this.clockElm = clockElm;
  this.mockTime = new Date();
  this.events = [];
  this.timeMultiplier = 60;
  this.eventCursor = 0;
  this.format = d3.time.format('%b %e %I:%M %p')
}

TimeEventRegistry.prototype.register = function(time, func, endTime) {
  var minTime = (new Date('2012-10-04 10:00')).getTime();
  var maxTime = (new Date('2012-10-04 12:00')).getTime();
  time = new Date(time);
  endTime = new Date(endTime);
  if((time.getTime() > minTime && time.getTime() < maxTime) || (endTime.getTime() > minTime && endTime.getTime() < maxTime)){
    // alert(1);
    this.events.push({
      "time": time,
      "endTime": new Date(endTime),
      "func": func
    })  
  }
}

TimeEventRegistry.prototype.sort = function() {
  this.events.sort(function(eventA, eventB) {
    x = eventA["time"].getTime();
    y = eventB["time"].getTime();
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
  });
}

TimeEventRegistry.prototype.start = function() {
  this.timeCheckPoint = new Date();
  this.mockTime = this.events[0]["time"];
  this.run();
}

TimeEventRegistry.prototype.run = function() {
  var curTime = new Date();
  var timeDiff = curTime.getTime() - this.timeCheckPoint.getTime();
  var newMockTime = new Date(this.mockTime.getTime() + (timeDiff * this.timeMultiplier));

  this.clockElm.text(this.format(newMockTime));

  for(;this.eventCursor < this.events.length; this.eventCursor++) {
    if(this.events[this.eventCursor]["time"] < newMockTime) {
      this.events[this.eventCursor]["func"]();
    }else{
      break;
    }
  }
  this.timeCheckPoint = curTime;
  this.mockTime = newMockTime;
  if(this.eventCursor < this.events.length) {
    setInterval(bind(this, this.run), 500);  
  }
}

TimeEventRegistry.prototype.getMultiplier = function() {
  return this.timeMultiplier;
}

TimeEventRegistry.prototype.getStartDate = function() {
  return this.events[0]["time"]; 
}

TimeEventRegistry.prototype.getEndDate = function() {
  return this.events[this.events.length - 1]["endTime"]; 
}
